import { Config } from '@start9labs/start-sdk/lib/config/builder/config'
import { List } from '@start9labs/start-sdk/lib/config/builder/list'
import { Value } from '@start9labs/start-sdk/lib/config/builder/value'

export const remoteNodes = Value.list(
  List.obj(
    {
      name: 'Remote Nodes',
      description: 'List of Lightning Network node instances to manage',
    },
    {
      spec: Config.of({
        implementation: Value.select({
          name: 'Implementation',
          description:
            'The underlying Lightning Network node implementation: currently, LND or Core Lightning',
          required: { default: null },
          values: {
            lnd: 'LND',
            cln: 'Core Lightning',
          },
          immutable: true,
        }),
        ln_node: Value.text({
          name: 'Node Name',
          description: 'Name of this node in the list',
          required: {
            default: null,
          },
          immutable: true,
          placeholder: 'Remote Node 1',
          patterns: [
            {
              regex: '[A-Za-z0-9]+',
              description: 'Name can only contain A-Z, a-z, and 0-9',
            },
          ],
        }),
        ln_server_url: Value.text({
          name: 'REST Server URL',
          required: { default: null },
          description: `The fully qualified URL of your node's REST server, including protocol and port.\nNOTE: RTL does not support a .onion URL here`,
          placeholder: 'https://<hostname>.com:8080',
        }),
        macaroon: Value.text({
          name: 'Macaroon',
          required: {
            default: null,
          },
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
      displayAs: '{{ln_node}}',
      uniqueBy: 'ln_node',
    },
  ),
)

export const configSpec = Config.of({
  internalLnd: Value.toggle({
    name: 'LND (internal)',
    description:
      'Enable to connect RTL with the LND node on your Start9 server',
    default: false,
  }),
  internalCln: Value.toggle({
    name: 'Core Lightning (internal)',
    description:
      'Enable to connect RTL with the Core Lightning node on your Start9 server',
    default: false,
  }),
  remoteNodes,
})

export type ConfigSpec = typeof configSpec.validator._TYPE
