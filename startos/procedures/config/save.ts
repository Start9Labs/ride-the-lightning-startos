import { ConfigSpec } from './spec'
import { WrapperData } from '../../wrapperData'
import { Save } from 'start-sdk/lib/config/setupConfig'
import { Manifest } from '../../manifest'
import { Dependency } from 'start-sdk/lib/types'
import { rtlConfig } from './file-models/RTL-Config.json'

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
  const nodes: typeof config.nodes = input.nodes.map((node, i) => {
    const index = i + 1
    const imp = node.union.unionSelectKey
    const { name, connectionSettings } = node.union.unionValueKey

    let hostname: string
    let rest_port: number
    let macaroon_path: string

    // internal
    if (connectionSettings.unionSelectKey === 'internal') {
      if (imp === 'lnd') {
        hostname = 'lnd.embassy'
        rest_port = 8080
        macaroon_path = '/mnt/lnd'
      } else {
        hostname = 'c-lightning.embassy'
        rest_port = 3001
        macaroon_path = '/mnt/c-lightning'
      }
      // external
    } else {
      hostname = connectionSettings.unionValueKey.hostname
      rest_port = connectionSettings.unionValueKey.rest_port
      macaroon_path =
        imp === 'lnd'
          ? `/root/lnd-external-${index}/admin.macaroon`
          : `/root/cl-external-${index}/access.macaroon`
    }

    const savedNode = config.nodes.find((n) => n.ln_node === name)

    return {
      index,
      ln_implementation: imp === 'lnd' ? 0 : 1,
      ln_node: name,
      Authentication: {
        macaroon_path,
      },
      Settings: savedNode?.Settings || {
        user_persona: 1,
        theme_mode: 1,
        theme_color: 0,
        fiat_conversion: false,
        channel_backup_path: `/root/backup/node-${index}`,
        ln_server_url: `https://${hostname}:${rest_port}`,
        enable_offers: undefined,
        unannounced_channels: undefined,
        currency_unit: undefined,
      },
    }
  })

  await rtlConfig.write(
    {
      ...config!,
      nodes,
    },
    effects,
  )

  // determine dependencies
  let currentDeps: Dependency[] = []
  if (input.nodes.some((n) => n.union.unionSelectKey === 'lnd'))
    currentDeps.push(dependencies.running('lnd'))
  if (input.nodes.some((n) => n.union.unionSelectKey === 'c-lightning'))
    currentDeps.push(dependencies.running('c-lightning'))

  const dependenciesReceipt = await effects.setDependencies(currentDeps)

  return {
    dependenciesReceipt,
    restart: true,
  }
}
