import { sdk } from './sdk'
import { rtlConfig } from './file-models/RTL-Config.json'
import { T } from '@start9labs/start-sdk'
import { hasInternal, uiPort } from './utils'
import { manifest as lndManifest } from 'lnd-startos/startos/manifest'
import { manifest as clnManifest } from 'cln-startos/startos/manifest'

export const main = sdk.setupMain(async ({ effects, started }) => {
  /**
   * ======================== Setup (optional) ========================
   *
   * In this section, we fetch any resources or run any desired preliminary commands.
   */
  console.info('Starting Ride The Lightning...')

  const depResult = await sdk.checkDependencies(effects)
  depResult.throwIfNotSatisfied()

  let mounts = sdk.Mounts.of().addVolume('main', null, '/data', false)

  const { nodes } = (await rtlConfig.read.const(effects))!

  if (hasInternal(nodes, 'lnd')) {
    mounts = mounts.addDependency<typeof lndManifest>(
      'lnd',
      'main',
      null,
      '/lnd',
      true,
    )
  }

  if (hasInternal(nodes, 'c-lightning')) {
    mounts = mounts.addDependency<typeof clnManifest>(
      'c-lightning',
      'main',
      null,
      '/c-lightning',
      true,
    )
  }

  /**
   * ======================== Additional Health Checks (optional) ========================
   *
   * In this section, we define *additional* health checks beyond those included with each daemon (below).
   */
  const additionalChecks: T.HealthCheck[] = []

  /**
   * ======================== Daemons ========================
   *
   * In this section, we create one or more daemons that define the service runtime.
   *
   * Each daemon defines its own health check, which can optionally be exposed to the user.
   */
  return sdk.Daemons.of(effects, started, additionalChecks).addDaemon(
    'primary',
    {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'rtl' },
        sdk.Mounts.of().addVolume('main', null, '/data', false),
        'rtl-sub',
      ),
      command: ['node', 'rtl'],
      env: {
        RTL_CONFIG_PATH: '/data', // TODO confirm package path
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
    },
  )
})
