import { sdk } from './sdk'
import { rtlConfig } from './fileModels/RTL-Config.json'
import {
  clnMountpoint,
  clnRestHostId,
  eclairMountpoint,
  hasInternal,
  lndMountpoint,
  uiPort,
} from './utils'
import { manifest as lndManifest } from 'lnd-startos/startos/manifest'
import { manifest as clnManifest } from 'cln-startos/startos/manifest'
import { manifest as eclairManifest } from 'eclair-startos/startos/manifest'
import {
  controlHostId as lndControlHostId,
  restPort,
} from 'lnd-startos/startos/interfaces'
import { clnrestPort } from 'cln-startos/startos/utils'
import { eclairConf } from 'eclair-startos/startos/fileModels/eclair.conf'
import {
  apiHostId as eclairApiHostId,
  apiPort as eclairApiPort,
} from 'eclair-startos/startos/utils'

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
  const hasEclair = hasInternal(nodes, 'eclair')

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

  if (hasEclair) {
    mounts = mounts.mountDependency<typeof eclairManifest>({
      dependencyId: 'eclair',
      volumeId: 'main',
      subpath: null,
      mountpoint: eclairMountpoint,
      readonly: true,
    })
  }

  // Internal nodes reach LND/CLN over the LXC bridge (`.startos` DNS is retired
  // in StartOS 0.4.x). Resolve the live bridge addresses via `.const()` and
  // rewrite the internal nodes' server URLs before starting the daemon: the
  // bridge address only changes on dependency install/uninstall/port-change, so
  // RTL restarts to heal exactly then and never on dependency updates. LND
  // terminates its own TLS over the bridge (https); clnrest serves plaintext
  // (http). Internal nodes are identified by their credential mountpoints, which
  // are stable.
  const rtlSub = sdk.SubContainer.of(
    effects,
    { imageId: 'rtl' },
    mounts,
    'rtl-sub',
  )

  if (hasLnd || hasCln || hasEclair) {
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
    const eclairAddr = hasEclair
      ? await sdk.host
          .getBridgeAddress(effects, {
            packageId: 'eclair',
            hostId: eclairApiHostId,
            internalPort: eclairApiPort,
            ssl: false,
          })
          .const()
      : null
    const lndUrl = lndAddr ? `https://${lndAddr}` : undefined
    const clnUrl = clnAddr ? `http://${clnAddr}` : undefined
    const eclairUrl = eclairAddr ? `http://${eclairAddr}` : undefined
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
    if (hasEclair && !eclairUrl) {
      throw new Error(
        'Eclair is not yet reachable on the internal network. Ensure Eclair is installed and running.',
      )
    }

    // Eclair authenticates with a password rather than a credential file, and
    // keeps it in its own config. Read it from the mounted volume on every
    // start so a rotation reaches RTL without the user retyping it. RTL can
    // parse that file itself given `configPath`, but only through a HOCON
    // library that has never been asked to read the JSON form Eclair's package
    // writes.
    const eclairPassword = hasEclair
      ? await eclairConf
          .withPath(`${await rtlSub.rootfs}${eclairMountpoint}/eclair.conf`)
          .read((c) => c['api.password'])
          .const(effects)
      : null
    if (hasEclair && !eclairPassword) {
      throw new Error(
        'Eclair has no API password set. Run its Set API Password action first.',
      )
    }

    const updatedNodes = nodes.map((n) =>
      lndUrl && n.authentication.macaroonPath?.startsWith(lndMountpoint)
        ? { ...n, settings: { ...n.settings, lnServerUrl: lndUrl } }
        : clnUrl && n.authentication.runePath?.startsWith(clnMountpoint)
          ? { ...n, settings: { ...n.settings, lnServerUrl: clnUrl } }
          : eclairUrl && n.lnImplementation === 'ECL'
            ? {
                ...n,
                authentication: {
                  ...n.authentication,
                  lnApiPassword: eclairPassword ?? undefined,
                },
                settings: { ...n.settings, lnServerUrl: eclairUrl },
              }
            : n,
    )
    await rtlConfig.merge(effects, { nodes: updatedNodes })
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
        TRUSTED_PROXIES: '10.0.3.1',
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
