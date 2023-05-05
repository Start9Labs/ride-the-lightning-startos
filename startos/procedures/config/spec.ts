import { Config } from '@start9labs/start-sdk/lib/config/builder/config'
import { List } from '@start9labs/start-sdk/lib/config/builder/list'
import { Value } from '@start9labs/start-sdk/lib/config/builder/value'
import { Variants } from '@start9labs/start-sdk/lib/config/builder/variants'

export const nodes = Value.list(
  List.obj(
    {
      name: 'Lightning Nodes',
      minLength: 1,
      maxLength: null,
      default: [],
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
        name: Value.text({
          name: 'Node Name',
          description: 'Name of this node in the list',
          required: {
            default: null,
          },
          immutable: true,
          placeholder: 'LND/CLN Node 1',
        }),
        connectionSettings: Value.union(
          {
            name: 'Connection Settings',
            description:
              '- Internal: A Lightning node running on this server.\n- External: A Lightning node running on a remote server (advanced).',
            required: { default: 'internal' },
            immutable: true,
          },
          Variants.of({
            internal: { name: 'Internal', spec: Config.of({}) },
            external: {
              name: 'External (advanced)',
              spec: Config.of({
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
            },
          }),
        ),
      }),
      displayAs: '{{name}}',
      uniqueBy: 'name',
    },
  ),
)

export const configSpec = Config.of({
  nodes,
})

export type ConfigSpec = typeof configSpec.validator._TYPE
