import { sdk } from './sdk'
import { rtlConfig } from './file-models/RTL-Config.json'
import { clnMountpoint, hasInternal, lndMountpoint, uiPort } from './utils'
import { manifest as lndManifest } from 'lnd-startos/startos/manifest'
import { manifest as clnManifest } from 'cln-startos/startos/manifest'
import { setNodes } from './actions/setNodes'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup ========================
   */
  console.info('Starting Ride The Lightning...')

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

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
      reason: 'Choose which nodes RTL will manage',
    })
    throw new Error('nodes not found in config file')
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
  return sdk.Daemons.of(effects, started).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'rtl' },
      mounts,
      'rtl-sub',
    ),
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
