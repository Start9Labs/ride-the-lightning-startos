import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { rm } from 'fs/promises'
import { rtlConfig } from '../../file-models/RTL-Config.json'
import { clnMountpoint, lndMountpoint } from '../../utils'

export const v_0_15_4_2 = VersionInfo.of({
  version: '0.15.4-beta:2-alpha.0',
  releaseNotes: 'Updated for StartOS v0.4.0',
  migrations: {
    up: async ({ effects }) => {
      const config = await rtlConfig.read().once()

      await rtlConfig.merge(effects, {
        nodes: config?.nodes.map((n, index) => {
          if (n.settings.lnServerUrl.includes('lnd.embassy')) {
            n.settings.lnServerUrl = 'https://lnd.startos:8080'
            n.lnNode = 'Internal-LND'
            n.index = 1
            n.authentication.macaroonPath = lndMountpoint
          } else if (n.settings.lnServerUrl.includes('c-lightning.embassy')) {
            n.settings.lnServerUrl = 'https://c-lightning.startos:8080'
            n.lnNode = 'Internal-CLN'
            n.index = 2
            n.authentication.runePath = clnMountpoint
          } else {
            n.index = index + 2
          }

          return n
        }),
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
    },
    down: IMPOSSIBLE,
  },
})
