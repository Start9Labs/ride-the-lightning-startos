import { mkdir, readFile, writeFile } from 'fs/promises'
import { rtlConfig } from '../fileModels/RTL-Config.json'
import { sdk } from '../sdk'
import { RtlConfig } from '../fileModels/RTL-Config.json'
import { clnMountpoint, hasInternal, lndMountpoint } from '../utils'
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
          immutable: false,
        }),
        lnNode: Value.text({
          name: 'Node Name',
          description: 'Name of this node in the list',
          required: true,
          default: null,
          immutable: false,
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
  internalNodes: Value.multiselect({
    name: 'Internal Nodes',
    description:
      '- LND: Lightning Network Daemon from Lightning Labs\n- CLN: Core Lightning from Blockstream\n',
    values: {
      lnd: 'Lightning Network Daemon (LND)',
      cln: 'Core Lightning (CLN)',
    },
    default: ['lnd'],
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
    const nodes = await rtlConfig.read((c) => c.nodes).const(effects)
    if (!nodes) throw new Error('nodes not found in config file')

    const configuredNodes: ('lnd' | 'cln')[] = []
    if (hasInternal(nodes, 'lnd')) configuredNodes.push('lnd')
    if (hasInternal(nodes, 'c-lightning')) configuredNodes.push('cln')

    return {
      internalNodes: configuredNodes,
      remoteNodes: await Promise.all(
        nodes
          .filter(
            (n) =>
              !n.settings.lnServerUrl.includes('lnd.startos') &&
              !n.settings.lnServerUrl.includes('c-lightning.startos'),
          )
          .map(async (n) => ({
            lnImplementation: n.lnImplementation,
            lnNode: n.lnNode,
            lnServerUrl: n.settings.lnServerUrl,
            macaroon: await readFile(
              n.authentication.macaroonPath || n.authentication.runePath || '',
              {
                encoding: 'base64',
              },
            ),
          })),
      ),
    }
  },

  // the execution function
  async ({ effects, input }) => {
    let nodes: RtlConfig['nodes'] = []

    const internalBackupPath = '/root/backup/Internal-'

    if (input.internalNodes.includes('lnd')) {
      const channelBackupPath = `${internalBackupPath}LND`
      await mkdir(channelBackupPath, { recursive: true })

      nodes.push(
        await toRtlNode({
          index: 1,
          lnImplementation: 'LND',
          lnNode: 'Internal LND',
          authentication: {
            macaroonPath: `${lndMountpoint}/data/chain/bitcoin/mainnet`,
          },
          channelBackupPath,
          lnServerUrl: `https://lnd.startos:8080`,
        }),
      )
    }

    if (input.internalNodes.includes('cln')) {
      const channelBackupPath = `${internalBackupPath}CLN`
      await mkdir(channelBackupPath, { recursive: true })

      nodes.push(
        await toRtlNode({
          index: 2,
          lnImplementation: 'CLN',
          lnNode: 'Internal CLN',
          authentication: {
            runePath: `${clnMountpoint}/.commando-env`,
          },
          channelBackupPath,
          lnServerUrl: 'https://c-lightning.startos:3010',
        }),
      )
    }

    const config = await rtlConfig.read().once()
    if (!config) throw new Error('Config file not found')

    await Promise.all(
      input.remoteNodes.map(async (node, index) => {
        const { lnImplementation, lnNode, lnServerUrl, macaroon } = node
        const hyphenatedName = lnNode.replace(/\s+/g, '-')

        // macaroon
        const credentialPath = `/root/remote-macaroons/${hyphenatedName}`
        await mkdir(credentialPath, { recursive: true })
        await writeFile(
          `${credentialPath}/${
            lnImplementation === 'LND' ? 'admin' : 'access'
          }.macaroon`,
          macaroon,
        )

        // backup
        const channelBackupPath = `/root/backup/${hyphenatedName}`
        await mkdir(channelBackupPath, { recursive: true })

        const savedNode = config.nodes.find((n) => n.lnNode === lnNode)

        const authentication =
          lnImplementation === 'LND'
            ? { macaroonPath: credentialPath }
            : { runePath: credentialPath }

        nodes.push(
          await toRtlNode({
            index: index + 3, // start with 2 to account for internal LND and CLN
            lnImplementation,
            lnNode,
            authentication,
            channelBackupPath,
            lnServerUrl,
            settings: savedNode?.settings,
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
  authentication,
  channelBackupPath,
  lnServerUrl,
  settings,
}: {
  index: number
  lnImplementation: 'LND' | 'CLN'
  lnNode: string
  authentication: RtlConfig['nodes'][0]['authentication']
  channelBackupPath: string
  lnServerUrl: string
  settings?: RtlConfig['nodes'][0]['settings']
}): Promise<RtlConfig['nodes'][0]> {
  return {
    index,
    lnImplementation,
    lnNode,
    authentication,
    settings: settings || {
      themeMode: 'NIGHT',
      themeColor: 'PINK',
      channelBackupPath,
      lnServerUrl,
    },
  }
}
