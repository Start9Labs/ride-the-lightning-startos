import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { rmdir } from 'fs/promises'
import { rtlConfig } from '../../file-models/RTL-Config.json'

export const v_0_15_4_2 = VersionInfo.of({
  version: '0.15.4:2',
  releaseNotes: 'Revamped for StartOS 0.4.0',
  migrations: {
    up: async ({ effects }) => {
      const config = (await rtlConfig.read().once())!

      // update nodes to accommodate new config approach
      await rtlConfig.merge(effects, {
        nodes: config.nodes.map((n, index) => {
          if (n.Settings.lnServerUrl === 'lnd.startos:8080') {
            n.lnNode = 'Internal-LND'
            n.index = 1
            n.Authentication.macaroonPath = '/lnd'
          } else if (n.Settings.lnServerUrl === 'c-lightning.startos:3001') {
            n.lnNode = 'Internal-CLN'
            n.index = 2
            n.Authentication.macaroonPath = '/c-lightning'
          } else {
            n.index = index + 2
          }

          return n
        }),
      })

      await rmdir('/root/lnd-external') // TODO Check if dir still exists
      await rmdir('/root/start9')
    },
    down: IMPOSSIBLE,
  },
})
