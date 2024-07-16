import { sdk } from '../sdk'
import { rtlConfig } from '../file-models/RTL-Config.json'
import { readFile, rmdir } from 'fs/promises'
import { load } from 'js-yaml'

type ConfigYaml = {
  password: string
}

export const v0_15_2_1 = sdk.Migration.of({
  version: '0.15.2:1',
  up: async ({ effects }) => {
    await rmdir('/root/lnd-external') // TODO Check if dir still exists

    const config = (await rtlConfig.read(effects))!

    // get old config.yaml
    const configYaml = load(
      await readFile('/root/start9/config.yaml', 'utf-8'),
    ) as ConfigYaml

    // Save password to Store
    await sdk.store.setOwn(effects, sdk.StorePath.password, configYaml.password)

    // update nodes to accommodate new config approach
    config.nodes = await Promise.all(
      config.nodes.map(async (n, index) => {
        if (n.Settings.lnServerUrl === 'lnd.embassy:8080') {
          n.lnNode = 'Internal-LND'
          n.index = 1
          n.Authentication.macaroonPath = '/lnd'
        } else if (n.Settings.lnServerUrl === 'c-lightning.embassy:3001') {
          n.lnNode = 'Internal-CLN'
          n.index = 2
          n.Authentication.macaroonPath = '/c-lightning'
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