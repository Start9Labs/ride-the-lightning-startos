import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { access, rm } from 'fs/promises'
import { rtlConfig } from '../../file-models/RTL-Config.json'
import { clnMountpoint, lndMountpoint } from '../../utils'

export const v_0_15_6_1_beta0 = VersionInfo.of({
  version: '0.15.6-beta:1-beta.0',
  releaseNotes: 'Updated for StartOS v0.4.0',
  migrations: {
    up: async ({ effects }) => {
      const config = await rtlConfig.read().once()
      try {
        await access('media/startos/volumes/main/start9')
        console.log('Update from 0.3.5.1 detected. Migrating nodes...')

        await rtlConfig.merge(effects, {
          nodes:
            config?.nodes?.map((n, index) => {
              if (n.settings.lnServerUrl.includes('lnd.embassy')) {
                n.settings.lnServerUrl = 'https://lnd.startos:8080'
                n.settings.channelBackupPath = '/root/backup/Internal-LND'
                n.lnNode = 'Internal LND'
                n.index = 1
                n.authentication.macaroonPath = `${lndMountpoint}/data/chain/bitcoin/mainnet`
              } else if (
                n.settings.lnServerUrl.includes('c-lightning.embassy')
              ) {
                n.settings.lnServerUrl = 'https://c-lightning.startos:3010'
                n.settings.channelBackupPath = '/root/backup/Internal-CLN'
                n.lnNode = 'Internal CLN'
                n.index = 2
                n.authentication.runePath = `${clnMountpoint}/.commando-env`
                n.lnImplementation = 'CLN'
              } else {
                n.index = index + 2
              }

              return n
            }) || [],
        })

        await Promise.all([
          rm('/media/startos/volumes/main/lnd-external', {
            recursive: true,
            force: true,
          }),
          rm('media/startos/volumes/main/start9', {
            recursive: true,
            force: true,
          }),
        ])
      } catch {
        console.log('Update from 040 package detected. Skipping migration')
      }
    },
    down: IMPOSSIBLE,
  },
})
