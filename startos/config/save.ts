import { sdk } from '../sdk'
import { setInterfaces } from '../interfaces'
import { setDependencies } from '../dependencies/dependencies'
import { configSpec } from './spec'
import { RtlConfig, rtlConfig } from '../file-models/RTL-Config.json'
import { writeFile, mkdir } from 'fs/promises'

export const save = sdk.setupConfigSave(
  configSpec,
  async ({ effects, input }) => {
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
          macaroonPath: '/lnd',
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
          macaroonPath: '/c-lightning',
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
    return {
      interfacesReceipt: await setInterfaces({ effects, input }), // Plumbing. DO NOT EDIT. This line causes setInterfaces() to run whenever config is saved.
      dependenciesReceipt: await setDependencies({ effects, input }), // Plumbing. DO NOT EDIT.
      restart: true, // optionally restart the service on config save.
    }
  },
)
