import { mkdir, readFile, writeFile } from 'fs/promises'
import { rtlConfig } from '../file-models/RTL-Config.json'
import { sdk } from '../sdk'
import { Config, hasInternal } from '../utils'
const { InputSpec, Value, List } = sdk

export const remoteNodes = Value.list(
  List.obj(
    {
      name: 'Remote Nodes',
      description: 'List of lightning nodes to manage',
    },
    {
      spec: InputSpec.of({
        lnImplementation: Value.select({
          name: 'Implementation',
          description:
            'The underlying lightning node implementation: currently, LND or CLN',
          values: {
            LND: 'LND',
            CLN: 'CLN',
          },
          default: 'LND',
          immutable: true,
        }),
        lnNode: Value.text({
          name: 'Node Name',
          description: 'Name of this node in the list',
          required: true,
          default: null,
          immutable: true,
          placeholder: 'Remote Node 1',
          patterns: [
            {
              regex: '[A-Za-z0-9]+',
              description: 'Name can only contain A-Z, a-z, and 0-9',
            },
          ],
        }),
        lnServerUrl: Value.text({
          name: 'REST Server URL',
          required: true,
          default: null,
          description: `The fully qualified URL of your node's REST server, including protocol and port.\nNOTE: RTL does not support a .onion URL here`,
          placeholder: 'https://<hostname>.com:8080',
        }),
        macaroon: Value.text({
          name: 'Macaroon',
          required: true,
          default: null,
          description:
            'Your admin.macaroon (LND) or access.macaroon (CLN), Base64URL encoded.',
          masked: true,
          patterns: [
            {
              regex: '[=A-Za-z0-9_-]+',
              description:
                'Macaroon must be encoded in Base64URL format (only A-Z, a-z, 0-9, _, - and = allowed)',
            },
          ],
        }),
      }),
      displayAs: '{{lnNode}}',
      uniqueBy: 'lnNode',
    },
  ),
)

export const inputSpec = InputSpec.of({
  internalLnd: Value.toggle({
    name: 'LND (on StartOS)',
    description: 'Connect RTL with you local LND node.',
    default: false,
  }),
  internalCln: Value.toggle({
    name: 'CLN (on StartOS)',
    description: 'Connect RTL with your local CLN node.',
    default: false,
  }),
  remoteNodes,
})

export const setNodes = sdk.Action.withInput(
  // id
  'set-nodes',

  // metadata
  async ({ effects }) => ({
    name: 'Set Nodes',
    description: 'Choose which nodes to manage from RTL',
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const { nodes } = (await rtlConfig.read.const(effects))!

    return {
      internalLnd: hasInternal(nodes, 'lnd'),
      internalCln: hasInternal(nodes, 'c-lightning'),
      remoteNodes: await Promise.all(
        nodes
          .filter(
            (n) =>
              !n.Settings.lnServerUrl.includes('lnd.embassy') &&
              !n.Settings.lnServerUrl.includes('c-lightning.embassy'),
          )
          .map(async (n) => ({
            lnImplementation: n.lnImplementation,
            lnNode: n.lnNode,
            lnServerUrl: n.Settings.lnServerUrl,
            macaroon: await readFile(n.Authentication.macaroonPath, {
              encoding: 'base64',
            }),
          })),
      ),
    }
  },

  // the execution function
  async ({ effects, input }) => {
    let nodes: Config['nodes'] = []

    const internalBackupPath = '/root/backup/Internal-'

    if (input.internalLnd) {
      const channelBackupPath = `${internalBackupPath}LND`
      await mkdir(channelBackupPath, { recursive: true })

      nodes.push(
        await toRtlNode({
          index: 1,
          lnImplementation: 'LND',
          lnNode: 'Internal LND',
          macaroonPath: '/lnd',
          channelBackupPath,
          lnServerUrl: `lnd.startos:8080`,
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
          macaroonPath: '/c-lightning',
          channelBackupPath,
          lnServerUrl: 'c-lightning.startos:3001',
        }),
      )
    }

    const config = (await rtlConfig.read.const(effects))!

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
            macaroonPath,
            channelBackupPath,
            lnServerUrl,
            settings: savedNode?.Settings,
          }),
        )
      }),
    )

    await rtlConfig.merge(effects, {
      nodes,
    })
  },
)

async function toRtlNode({
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
  settings?: Config['nodes'][0]['Settings']
}): Promise<Config['nodes'][0]> {
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
