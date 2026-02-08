import { sdk } from './sdk'
import { rtlConfig } from './fileModels/RTL-Config.json'
import { clnMountpoint, hasInternal, lndMountpoint, uiPort } from './utils'
import { manifest as lndManifest } from 'lnd-startos/startos/manifest'
import { manifest as clnManifest } from 'cln-startos/startos/manifest'
import { setNodes } from './actions/setNodes'
import { i18n } from './i18n'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   */
  console.info('Starting Ride The Lightning...')

  let mounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/root',
    readonly: false,
  })

  const config = await rtlConfig.read().const(effects)
  const nodes = config?.nodes
  if (!nodes) {
    await sdk.action.createOwnTask(effects, setNodes, 'critical', {
      reason: i18n('Choose which nodes RTL will manage'),
    })
    throw new Error(i18n('nodes not found in config file'))
  }

  if (hasInternal(nodes, 'lnd')) {
    mounts = mounts.mountDependency<typeof lndManifest>({
      dependencyId: 'lnd',
      volumeId: 'main',
      subpath: null,
      mountpoint: lndMountpoint,
      readonly: true,
    })
  }

  if (hasInternal(nodes, 'c-lightning')) {
    mounts = mounts.mountDependency<typeof clnManifest>({
      dependencyId: 'c-lightning',
      volumeId: 'main',
      subpath: null,
      mountpoint: clnMountpoint,
      readonly: true,
    })
  }

  /**
   * ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'rtl' },
      mounts,
      'rtl-sub',
    ),
    exec: {
      command: sdk.useEntrypoint(),
      runAsInit: true,
      env: {
        RTL_CONFIG_PATH: '/root',
      },
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })
})
