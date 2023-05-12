import { sdk } from '../sdk'
import { ExpectedExports } from '@start9labs/start-sdk/lib/types'
import { HealthReceipt } from '@start9labs/start-sdk/lib/health/HealthReceipt'
import { Daemons } from '@start9labs/start-sdk/lib/mainFn/Daemons'
import { dependencyMounts } from './dependencies/dependencyMounts'
import { rtlConfig } from './config/file-models/RTL-Config.json'
import { hasInternal } from '../utils'
import { uiPort } from './interfaces'

export const main: ExpectedExports.main = sdk.setupMain(
  async ({ effects, utils, started }) => {
    /**
     * ======================== Setup ========================
     *
     * In this section, you will fetch any resources or run any commands necessary to run the service
     */

    console.info('Starting Ride The Lightning!')

    const { nodes } = (await rtlConfig.read(effects))!

    if (hasInternal(nodes, 'lnd')) {
      await utils.mountDependencies(dependencyMounts.lnd)
    }

    if (hasInternal(nodes, 'c-lightning')) {
      await utils.mountDependencies(dependencyMounts['c-lightning'])
    }

    /**
     * ======================== Additional Health Checks (optional) ========================
     *
     * In this section, you will define additional health checks beyond those associated with daemons
     */
    const healthReceipts: HealthReceipt[] = []

    /**
     * ======================== Daemons ========================
     *
     * In this section, you will create one or more daemons that define the service runtime
     *
     * Each daemon defines its own health check, which can optionally be exposed to the user
     */

    return Daemons.of({
      effects,
      started,
      healthReceipts, // Provide the healthReceipts or [] to prove they were at least considered
    }).addDaemon('main', {
      command: ['node', 'rtl'], // The command to start the daemon
      env: {
        RTL_CONFIG_PATH: '/root',
      },
      requires: [],
      ready: {
        display: 'Service Ready',
        // The function to run to determine the health status of the daemon
        fn: () =>
          utils.checkPortListening(uiPort, {
            successMessage: 'Web interface is ready',
            errorMessage: 'Web interface is unreachable',
          }),
      },
    })
  },
)
