import { sdk } from './sdk'
import { uiPort } from './interfaces'
import { T } from '@start9labs/start-sdk'

export const main = sdk.setupMain(async ({ effects, started }) => {
   /**
     * ======================== Setup ========================
     */

   console.info('Starting Ride The Lightning...')

   /**
    * ======================== Additional Health Checks (optional) ========================
    */
   const healthReceipts: T.HealthReceipt[] = []

   /**
    * ======================== Daemons ========================
    */

   return sdk.Daemons.of({
     effects,
     started,
     healthReceipts,
    }).addDaemon('primary', {
      image: { id: 'main' }, 
      command: ['hello-world'], 
      mounts: sdk.Mounts.of().addVolume('main', null, '/data', false), 
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
  },
)