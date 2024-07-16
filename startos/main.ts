import { sdk } from './sdk'
import { uiPort } from './interfaces'
import { rtlConfig } from './file-models/RTL-Config.json'
import { T } from '@start9labs/start-sdk'
import { hasInternal } from './utils'
import { manifest as lndManifest } from 'lnd-startos/startos/manifest'
import { manifest as clnManifest } from 'cln-startos/startos/manifest'

export const main = sdk.setupMain(async ({ effects, started }) => {
   /**
     * ======================== Setup ========================
     */

   console.info('Starting Ride The Lightning...')

   const mounts = sdk.Mounts.of().addVolume('main', null, '/data', false)

   const { nodes } = (await rtlConfig.read(effects))!

   if (hasInternal(nodes, 'lnd')) {
    mounts.addDependency<typeof lndManifest>('lnd', 'main', null, '/lnd', true)
   }

   if (hasInternal(nodes, 'c-lightning')) {
    mounts.addDependency<typeof clnManifest>('c-lightning', 'main', null, '/c-lightning', true)
   }

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
      command: ['node', 'rtl'], 
      env: {
        RTL_CONFIG_PATH: '/data', // TODO confirm package path
      },
      mounts,
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