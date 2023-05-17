import { sdk } from '../../sdk'
import { rtlConfig } from '../config/file-models/RTL-Config.json'
import { readFile, rmdir } from 'fs/promises'
import { dependencyMounts } from '../dependencies/dependencyMounts'
import { load } from 'js-yaml'

type ConfigYaml = {
  password: string
}

export const v0_13_6_2 = sdk.Migration.of({
  version: '0.13.6.2',
  up: async ({ effects, utils }) => {
    await rmdir('/root/lnd-external') // from 0.12.3 migration

    const config = (await rtlConfig.read(effects))!

    // get old config.yaml
    const configYaml = load(
      await readFile('/root/start9/config.yaml', 'utf-8'),
    ) as ConfigYaml

    // Save password to vault
    await effects.vault.set({ key: 'password', value: configYaml.password })

    // update nodes to accommodate new config approach
    config.nodes = await Promise.all(
      config.nodes.map(async (n, index) => {
        if (n.Settings.lnServerUrl === 'lnd.embassy:8080') {
          n.lnNode = 'Internal-LND'
          n.index = 1
          n.Authentication.macaroonPath = await utils.mountDependencies(
            dependencyMounts.lnd.main.rootDir,
          )
        } else if (n.Settings.lnServerUrl === 'c-lightning.embassy:3001') {
          n.lnNode = 'Internal-CLN'
          n.index = 2
          n.Authentication.macaroonPath = await utils.mountDependencies(
            dependencyMounts['c-lightning'].main.rootDir,
          )
        } else {
          n.index = index + 2
        }

        return n
      }),
    )
    await rtlConfig.write(config, effects)

    // remove old start9 dir
    await rmdir('/root/start9')
  },
  down: async ({ effects }) => {
    throw new Error('Downgrade not permitted')
  },
})
