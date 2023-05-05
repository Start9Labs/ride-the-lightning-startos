import { ConfigSpec } from './spec'
import { WrapperData } from '../../wrapperData'
import { Save } from '@start9labs/start-sdk/lib/config/setupConfig'
import { Manifest } from '../../manifest'
import { Dependency } from '@start9labs/start-sdk/lib/types'
import { rtlConfig } from './file-models/RTL-Config.json'
import { writeFileSync } from 'fs'

/**
 * This function executes on config save
 *
 * Use it to persist config data to various files and to establish any resulting dependencies
 */
export const save: Save<WrapperData, ConfigSpec, Manifest> = async ({
  effects,
  utils,
  input,
  dependencies,
}) => {
  // save config
  const config = (await rtlConfig.read(effects))!
  const nodes: typeof config.nodes = input.nodes.map((node, index) => {
    const { implementation, name, connectionSettings } = node
    const hyphenatedName = name.replace(/\s+/g, '-')

    let ln_server_url: string
    let macaroon_path: string
    // internal
    if (connectionSettings.unionSelectKey === 'internal') {
      if (implementation === 'lnd') {
        ln_server_url = `lnd.embassy:8080`
        macaroon_path = '/mnt/lnd'
      } else {
        ln_server_url = 'c-lightning.embassy:3001'
        macaroon_path = '/mnt/c-lightning'
      }
      // external
    } else {
      ln_server_url = connectionSettings.unionValueKey.ln_server_url
      macaroon_path = `/root/external-macaroons/${hyphenatedName}.macaroon`
      writeFileSync(macaroon_path, connectionSettings.unionValueKey.macaroon)
    }

    const savedNode = config.nodes.find((n) => n.ln_node === name)

    return {
      index: index + 1,
      ln_implementation: implementation === 'lnd' ? 0 : 1,
      ln_node: name,
      Authentication: {
        macaroon_path,
      },
      Settings: savedNode?.Settings || {
        user_persona: 1,
        theme_mode: 1,
        theme_color: (index < 5 ? index : index % 5) as 0 | 1 | 2 | 3 | 4,
        fiat_conversion: false,
        channel_backup_path: `/root/backup/${hyphenatedName}`,
        ln_server_url,
        // @TODO test if these are needed
        enable_offers: undefined,
        unannounced_channels: undefined,
        currency_unit: undefined,
      },
    }
  })

  await rtlConfig.write(
    {
      ...config,
      nodes,
    },
    effects,
  )

  // determine dependencies
  let currentDeps: Dependency[] = []
  if (input.nodes.some((n) => n.implementation === 'lnd'))
    currentDeps.push(dependencies.running('lnd'))
  if (input.nodes.some((n) => n.implementation === 'cln'))
    currentDeps.push(dependencies.running('c-lightning'))

  const dependenciesReceipt = await effects.setDependencies(currentDeps)

  return {
    dependenciesReceipt,
    restart: true,
  }
}
