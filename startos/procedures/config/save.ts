import { ConfigSpec } from './spec'
import { WrapperData } from '../../wrapperData'
import { Save } from '@start9labs/start-sdk/lib/config/setupConfig'
import { Manifest } from '../../manifest'
import { Dependency } from '@start9labs/start-sdk/lib/types'
import { RtlConfig, rtlConfig } from './file-models/RTL-Config.json'
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
  const config = (await rtlConfig.read(effects))!

  const toRtlNode = async ({
    index,
    lnImplementation,
    lnNode,
    macaroonPath,
    channelBackupPath,
    lnServerUrl,
    settings,
  }: {
    index: number
    lnImplementation: 'LND' | 'CLN'
    lnNode: string
    macaroonPath: string
    channelBackupPath: string
    lnServerUrl: string
    settings?: RtlConfig['nodes'][0]['Settings']
  }): Promise<RtlConfig['nodes'][0]> => {
    return {
      index,
      lnImplementation,
      lnNode,
      Authentication: {
        macaroonPath,
      },
      Settings: settings || {
        themeMode: 'NIGHT',
        themeColor: 'PINK',
        channelBackupPath,
        lnServerUrl,
      },
    }
  }

  let nodes: RtlConfig['nodes'] = []

  const internalBackupPath = '/root/backup/Internal-'

  if (input.internalLnd) {
    const channelBackupPath = `${internalBackupPath}LND`
    await mkdir(channelBackupPath, { recursive: true })

    nodes.push(
      await toRtlNode({
        index: 1,
        lnImplementation: 'LND',
        lnNode: 'Internal LND',
        lnServerUrl: `lnd.embassy:8080`,
        macaroonPath: dependencyMounts.lnd.main.root.mountpoint,
        channelBackupPath,
      }),
    )
  }

  if (input.internalCln) {
    const channelBackupPath = `${internalBackupPath}CLN`
    await mkdir(channelBackupPath, { recursive: true })

    nodes.push(
      await toRtlNode({
        index: 2,
        lnImplementation: 'CLN',
        lnNode: 'Internal CLN',
        lnServerUrl: 'c-lightning.embassy:3001',
        macaroonPath: dependencyMounts['c-lightning'].main.root.mountpoint,
        channelBackupPath,
      }),
    )
  }

  await Promise.all(
    input.remoteNodes.map(async (node, index) => {
      const { lnImplementation, lnNode, lnServerUrl, macaroon } = node
      const hyphenatedName = lnNode.replace(/\s+/g, '-')

      // macaroon
      const macaroonPath = `/root/remote-macaroons/${hyphenatedName}`
      await mkdir(macaroonPath, { recursive: true })
      await writeFile(
        `${macaroonPath}/${
          lnImplementation === 'LND' ? 'admin' : 'access'
        }.macaroon`,
        macaroon,
      )

      // backup
      const channelBackupPath = `/root/backup/${hyphenatedName}`
      await mkdir(channelBackupPath, { recursive: true })

      const savedNode = config.nodes.find((n) => n.lnNode === lnNode)

      nodes.push(
        await toRtlNode({
          index: index + 3, // start with 2 to account for internal LND and CLN
          lnImplementation,
          lnNode,
          lnServerUrl,
          macaroonPath,
          channelBackupPath,
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
}
