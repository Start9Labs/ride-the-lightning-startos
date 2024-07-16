import { sdk } from '../sdk'
const { Config, Value, List } = sdk

export const remoteNodes = Value.list(
  List.obj(
    {
      name: 'Remote Nodes',
      description: 'List of Lightning Network node instances to manage',
    },
    {
      spec: Config.of({
        lnImplementation: Value.select({
          name: 'Implementation',
          description:
            'The underlying Lightning Network node implementation: currently, LND or CLN',
          required: { default: null },
          values: {
            LND: 'LND',
            CLN: 'CLN',
          },
          immutable: true,
        }),
        lnNode: Value.text({
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
        lnServerUrl: Value.text({
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
      displayAs: '{{lnNode}}',
      uniqueBy: 'lnNode',
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
    name: 'CLN (internal)',
    description:
      'Enable to connect RTL with the CLN node on your Start9 server',
    default: false,
  }),
  remoteNodes,
})

export type ConfigSpec = typeof configSpec.validator._TYPE