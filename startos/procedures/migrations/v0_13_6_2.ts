import { sdk } from '../../sdk'
import { rtlConfig } from '../config/file-models/RTL-Config.json'
import { rmdir } from 'fs/promises'
import { dependencyMounts } from '../dependencies/dependencyMounts'

export const v0_13_6_2 = sdk.Migration.of({
  version: '0.13.6.2',
  up: async ({ effects, utils }) => {
    await rmdir('/root/lnd-external') // from 0.12.3 migration

    const config = (await rtlConfig.read(effects))!

    // Save password to vault
    await effects.vault.set({ key: 'password', value: config.multiPass })

    // update nodes to accommodate new config approach
    config.nodes = config.nodes.map((n, index) => {
      if (n.Settings.lnServerUrl === 'lnd.embassy:8080') {
        n.lnNode = 'Internal-LND'
        n.index = 1
        n.Authentication.macaroonPath =
          dependencyMounts.lnd.main.root.mountpoint
      } else if (n.Settings.lnServerUrl === 'c-lightning.embassy:3001') {
        n.lnNode = 'Internal-CLN'
        n.index = 2
        n.Authentication.macaroonPath =
          dependencyMounts['c-lightning'].main.root.mountpoint
      } else {
        n.index = index + 2
      }

      return n
    })
    await rtlConfig.write(config, effects)

    // remove old start9 dir
    await rmdir('/root/start9')
  },
  down: async ({ effects }) => {
    throw new Error('Downgrade not permitted')
  },
})
