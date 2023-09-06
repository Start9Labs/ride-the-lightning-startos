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
     */

    console.info('Starting Ride The Lightning...')

    const { nodes } = (await rtlConfig.read(effects))!

    if (hasInternal(nodes, 'lnd')) {
      await utils.mountDependencies(dependencyMounts.lnd)
    }

    if (hasInternal(nodes, 'c-lightning')) {
      await utils.mountDependencies(dependencyMounts['c-lightning'])
    }

    /**
     * ======================== Additional Health Checks (optional) ========================
     */
    const healthReceipts: HealthReceipt[] = []

    /**
     * ======================== Daemons ========================
     */

    return Daemons.of({
      effects,
      started,
      healthReceipts,
    }).addDaemon('main', {
      command: ['node', 'rtl'],
      env: {
        RTL_CONFIG_PATH: '/root',
      },
      requires: [],
      ready: {
        display: 'Service Ready',
        fn: () =>
          utils.checkPortListening(uiPort, {
            successMessage: 'Web interface is ready',
            errorMessage: 'Web interface is unreachable',
          }),
      },
    })
  },
)
