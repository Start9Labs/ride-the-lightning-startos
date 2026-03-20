import { VersionInfo, IMPOSSIBLE, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { rtlConfig } from '../../fileModels/RTL-Config.json'
import { clnMountpoint, lndMountpoint } from '../../utils'

export const v_0_15_8_2_b2 = VersionInfo.of({
  version: '0.15.8:2-beta.2',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      // 0.3.5.1 migration: migrate .embassy URLs to .startos
      const configYaml = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        const config = await rtlConfig.read().once()

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

        await rm('/media/startos/volumes/main/lnd-external', {
          recursive: true,
          force: true,
        }).catch(console.log)

        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
          force: true,
        }).catch(console.log)
      }
    },
    down: IMPOSSIBLE,
  },
})
