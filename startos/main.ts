import { T, utils } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { rtlConfig } from './fileModels/RTL-Config.json'
import { clnMountpoint, hasInternal, lndMountpoint, uiPort } from './utils'
import { manifest as lndManifest } from 'lnd-startos/startos/manifest'
import { manifest as clnManifest } from 'cln-startos/startos/manifest'
import {
  controlHostId as lndControlHostId,
  lndconnectRestId,
} from 'lnd-startos/startos/interfaces'
import { readFile } from 'fs/promises'

// clnrest host + interface ids. cln exports only its peer/watchtower ids, so
// these are referenced by literal (see cln-startos/startos/interfaces.ts).
const clnRestHostId = 'clnrest'
const clnRestInterfaceId = 'clnrest'

// The IPv4 LXC-bridge hostname for an interface on an already-resolved host.
// `.startos` DNS is retired in StartOS 0.4.x; containers reach each other over
// the bridge. Pure — called inside a `sdk.host` map fn so `.const()` narrows
// its reactivity to just this address. lxcbr0 is dual-stack, so pin ipv4.
const bridgeHostname = (
  host: utils.FilledHost | null,
  interfaceId: string,
  ssl: boolean,
) => {
  const iface =
    host &&
    Object.values(host.bindings)
      .flatMap((b) => Object.values(b.interfaces))
      .find((i) => i.id === interfaceId)
  return iface?.addressInfo
    .filter({
      kind: 'bridge',
      predicate: (h) => h.ssl === ssl && h.metadata.kind === 'ipv4',
    })
    .hostnames[0]
}

// LND's REST endpoint over the bridge (replaces `https://lnd.startos:8080`).
// LND terminates its own TLS with a cert that covers the bridge address.
const lndRestBridgeUrl = (effects: T.Effects) =>
  sdk.host
    .get(effects, { hostId: lndControlHostId, packageId: 'lnd' }, (host) => {
      const h = bridgeHostname(host, lndconnectRestId, true)
      return h ? `https://${h.hostname}:${h.port}` : undefined
    })
    .const()

// CLN's clnrest endpoint over the bridge (replaces
// `https://c-lightning.startos:3010`). clnrest serves plaintext HTTP, so target
// the non-TLS bridge address directly rather than the StartOS SSL edge.
const clnRestBridgeUrl = (effects: T.Effects) =>
  sdk.host
    .get(
      effects,
      { hostId: clnRestHostId, packageId: 'c-lightning' },
      (host) => {
        const h = bridgeHostname(host, clnRestInterfaceId, false)
        return h ? `http://${h.hostname}:${h.port}` : undefined
      },
    )
    .const()

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Ride The Lightning...')

  let mounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/root',
    readonly: false,
  })

  const config = await rtlConfig.read().const(effects)
  const nodes = config?.nodes
  if (!nodes?.length) {
    throw new Error('No nodes configured. Run the "Set Nodes" action first.')
  }

  const hasLnd = hasInternal(nodes, 'lnd')
  const hasCln = hasInternal(nodes, 'c-lightning')

  if (hasLnd) {
    mounts = mounts.mountDependency<typeof lndManifest>({
      dependencyId: 'lnd',
      volumeId: 'main',
      subpath: null,
      mountpoint: lndMountpoint,
      readonly: true,
    })
  }

  if (hasCln) {
    mounts = mounts.mountDependency<typeof clnManifest>({
      dependencyId: 'c-lightning',
      volumeId: 'main',
      subpath: null,
      mountpoint: clnMountpoint,
      readonly: true,
    })
  }

  // Internal nodes reach LND/CLN over the LXC bridge (`.startos` DNS is retired
  // in StartOS 0.4.x). Resolve the live bridge addresses and rewrite the
  // internal nodes' server URLs before starting the daemon; the addresses can
  // change across restarts, so this runs on every start. Internal nodes are
  // identified by their credential mountpoints, which are stable.
  if (hasLnd || hasCln) {
    const lndUrl = hasLnd ? await lndRestBridgeUrl(effects) : undefined
    const clnUrl = hasCln ? await clnRestBridgeUrl(effects) : undefined
    if (hasLnd && !lndUrl) {
      throw new Error(
        'LND is not yet reachable on the internal network. Ensure LND is installed and running.',
      )
    }
    if (hasCln && !clnUrl) {
      throw new Error(
        'Core Lightning is not yet reachable on the internal network. Ensure Core Lightning is installed and running.',
      )
    }

    const updatedNodes = nodes.map((n) =>
      lndUrl && n.authentication.macaroonPath?.startsWith(lndMountpoint)
        ? { ...n, settings: { ...n.settings, lnServerUrl: lndUrl } }
        : clnUrl && n.authentication.runePath?.startsWith(clnMountpoint)
          ? { ...n, settings: { ...n.settings, lnServerUrl: clnUrl } }
          : n,
    )
    await rtlConfig.merge(effects, { nodes: updatedNodes })
  }

  const rtlSub = sdk.SubContainer.of(
    effects,
    { imageId: 'rtl' },
    mounts,
    'rtl-sub',
  )

  if (hasCln) {
    // Upstream RTL's setOptions caches per-node auth on first request and never
    // re-reads runePath if the first read fails or yields no LIGHTNING_RUNE
    // line. CLN writes .commando-env from a oneshot that races RTL startup, so
    // wait here until the file has the rune line before letting the daemon run.
    const rootfs = await rtlSub.rootfs
    const runePath = `${rootfs}${clnMountpoint}/.commando-env`
    const deadline = Date.now() + 120_000
    while (true) {
      try {
        const contents = await readFile(runePath, 'utf-8')
        if (/LIGHTNING_RUNE="[^"]+"/.test(contents)) break
      } catch {}
      if (Date.now() > deadline) {
        throw new Error(
          `Timed out waiting for CLN rune at ${clnMountpoint}/.commando-env`,
        )
      }
      console.info(`Waiting for CLN rune at ${clnMountpoint}/.commando-env...`)
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  /**
   * ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: rtlSub,
    exec: {
      command: ['node', 'rtl'],
      env: {
        RTL_CONFIG_PATH: '/root',
      },
    },
    ready: {
      display: 'Web Interface',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: 'The web interface is ready',
          errorMessage: 'The web interface is not ready',
        }),
    },
    requires: [],
  })
})
