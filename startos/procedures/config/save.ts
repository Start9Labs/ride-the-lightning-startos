import { ConfigSpec } from './spec'
import { WrapperData } from '../../wrapperData'
import { Save } from '@start9labs/start-sdk/lib/config/setupConfig'
import { Manifest } from '../../manifest'
import { Dependency } from '@start9labs/start-sdk/lib/types'
import { rtlConfig } from './file-models/RTL-Config.json'
import { writeFile, mkdir } from 'fs/promises'
import { dependencyMounts } from '../dependencyMounts'

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
  try {
    const config = (await rtlConfig.read(effects))!

    const toRtlNode = async ({
      index,
      implementation,
      ln_node,
      macaroon_path,
      channel_backup_path,
      ln_server_url,
      settings,
    }: {
      index: number
      implementation: 'lnd' | 'cln'
      ln_node: string
      macaroon_path: string
      channel_backup_path: string
      ln_server_url: string
      settings?: (typeof config.nodes)[0]['Settings']
    }): Promise<(typeof config.nodes)[0]> => {
      return {
        index: index + 1,
        ln_implementation: implementation === 'lnd' ? 0 : 1,
        ln_node,
        Authentication: {
          macaroon_path,
        },
        Settings: settings || {
          user_persona: 1,
          theme_mode: 1,
          theme_color: (index < 5 ? index : index % 5) as 0 | 1 | 2 | 3 | 4,
          fiat_conversion: false,
          channel_backup_path,
          ln_server_url,
          // @TODO test if these are needed
          enable_offers: undefined,
          unannounced_channels: undefined,
          currency_unit: undefined,
        },
      }
    }

    let nodes: typeof config.nodes = []

    if (input.internalLnd) {
      const channel_backup_path = '/root/backup/Internal-LND'
      await mkdir(channel_backup_path, { recursive: true })

      nodes.push(
        await toRtlNode({
          index: 0,
          implementation: 'lnd',
          ln_node: 'Internal LND',
          ln_server_url: `lnd.embassy:8080`,
          macaroon_path: dependencyMounts.lnd.main.root.mountpoint,
          channel_backup_path,
        }),
      )
    }

    if (input.internalCln) {
      const channel_backup_path = '/root/backup/Internal-CLN'
      await mkdir(channel_backup_path, { recursive: true })

      nodes.push(
        await toRtlNode({
          index: 1,
          implementation: 'cln',
          ln_node: 'Internal CLN',
          ln_server_url: 'c-lightning.embassy:3001',
          macaroon_path: dependencyMounts['c-lightning'].main.root.mountpoint,
          channel_backup_path,
        }),
      )
    }

    await Promise.all(
      input.remoteNodes.map(async (node, index) => {
        const { implementation, ln_node, ln_server_url, macaroon } = node
        const hyphenatedName = ln_node.replace(/\s+/g, '-')

        const macaroon_path = `/root/remote-macaroons/${hyphenatedName}.macaroon`
        const channel_backup_path = `/root/backup/${hyphenatedName}`

        await mkdir(macaroon_path, { recursive: true })
        await mkdir(channel_backup_path, { recursive: true })

        await writeFile(macaroon_path, macaroon)

        const savedNode = config.nodes.find((n) => n.ln_node === ln_node)

        nodes.push(
          await toRtlNode({
            index: index + 2, // start with 2 to account for internal LND and CLN
            implementation,
            ln_node,
            ln_server_url,
            macaroon_path,
            channel_backup_path,
            settings: savedNode?.Settings,
          }),
        )
      }),
    )

    await rtlConfig.write(
      {
        ...config,
        nodes,
      },
      effects,
    )

    // determine dependencies
    let currentDeps: Dependency[] = []
    if (input.internalLnd) currentDeps.push(dependencies.running('lnd'))
    if (input.internalCln) currentDeps.push(dependencies.running('c-lightning'))

    const dependenciesReceipt = await effects.setDependencies(currentDeps)

    return {
      dependenciesReceipt,
      restart: true,
    }
  } catch (e) {
    throw new Error('Failed to save RTL config' + e.message)
  }
}
