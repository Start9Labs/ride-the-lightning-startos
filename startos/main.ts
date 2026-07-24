import { sdk } from './sdk'
import { rtlConfig } from './fileModels/RTL-Config.json'
import {
  clnMountpoint,
  clnRestHostId,
  hasInternal,
  lndMountpoint,
  uiPort,
} from './utils'
import { manifest as lndManifest } from 'lnd-startos/startos/manifest'
import { manifest as clnManifest } from 'cln-startos/startos/manifest'
import {
  controlHostId as lndControlHostId,
  restPort,
} from 'lnd-startos/startos/interfaces'
import { clnrestPort } from 'cln-startos/startos/utils'

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
  // in StartOS 0.4.x). Resolve the live bridge addresses via `.const()` and
  // rewrite the internal nodes' server URLs before starting the daemon: the
  // mapped address only changes on dependency install/uninstall/port-change, so
  // RTL restarts to heal exactly then and never on dependency updates. LND
  // terminates its own TLS over the bridge (https); clnrest serves plaintext
  // (http). Internal nodes are identified by their credential mountpoints, which
  // are stable.
  if (hasLnd || hasCln) {
    const lndAddr = hasLnd
      ? await sdk.host
          .getBridgeAddress(effects, {
            packageId: 'lnd',
            hostId: lndControlHostId,
            internalPort: restPort,
          })
          .const()
      : null
    const clnAddr = hasCln
      ? await sdk.host
          .getBridgeAddress(effects, {
            packageId: 'c-lightning',
            hostId: clnRestHostId,
            internalPort: clnrestPort,
            ssl: false,
          })
          .const()
      : null
    const lndUrl = lndAddr ? `https://${lndAddr}` : undefined
    const clnUrl = clnAddr ? `http://${clnAddr}` : undefined
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
