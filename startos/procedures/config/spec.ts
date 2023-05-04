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
        union: Value.union(
          {
            name: 'Type',
            description:
              '- LND: Lightning Network Daemon from Lightning Labs\n- CLN: Core Lightning from Blockstream',
            required: { default: null },
          },
          Variants.of({
            lnd: {
              name: 'lnd',
              spec: Config.of({
                name: Value.text({
                  name: 'Node Name',
                  required: {
                    default: 'Start9 LND',
                  },
                  description: 'Name of this node in the list',
                }),
                connectionSettings: Value.union(
                  {
                    name: 'Connection Settings',
                    description:
                      '- Internal: The Lightning Network Daemon service installed to your Embassy.\n- External: A Lightning Network Daemon instance running on a remote device (advanced).\n',
                    required: { default: 'internal' },
                  },
                  Variants.of({
                    internal: { name: 'Internal', spec: Config.of({}) },
                    external: {
                      name: 'External',
                      spec: Config.of({
                        hostname: Value.text({
                          name: 'Public Address',
                          required: { default: null },
                          description:
                            'The public address of your LND REST server\nNOTE: RTL does not support a .onion URL here\n',
                        }),
                        rest_port: Value.number({
                          name: 'REST Port',
                          description:
                            'The port that your Lightning Network Daemon REST server is bound to',
                          required: {
                            default: 8080,
                          },
                          min: 1,
                          max: 65535,
                          integer: true,
                        }),
                        macaroon: Value.text({
                          name: 'Macaroon',
                          required: {
                            default: null,
                          },
                          description:
                            'Your admin.macaroon file, Base64URL encoded. This is the same as the value after "macaroon=" in your lndconnect URL.',
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
            },
            'c-lightning': {
              name: 'Core Lightning',
              spec: Config.of({
                name: Value.text({
                  name: 'Node Name',
                  required: {
                    default: 'Start9 CLN',
                  },
                  description: 'Name of this node in the list',
                }),
                connectionSettings: Value.union(
                  {
                    name: 'Connection Settings',
                    description:
                      '- Internal: The Core Lightning (CLN) service installed to your Embassy.\n- External: A Core Lightning (CLN) instance running on a remote device (advanced).\n',
                    required: { default: 'internal' },
                  },
                  Variants.of({
                    internal: { name: 'Internal', spec: Config.of({}) },
                    external: {
                      name: 'External',
                      spec: Config.of({
                        hostname: Value.text({
                          name: 'Public Address',
                          required: {
                            default: null,
                          },
                          description:
                            'The public address of your Core Lightning REST server\nNOTE: RTL does not support a .onion URL here\n',
                        }),
                        rest_port: Value.number({
                          name: 'REST Port',
                          description:
                            'The port that your Core Lightning REST server is bound to',
                          required: {
                            default: 3001,
                          },
                          min: 1,
                          max: 65535,
                          integer: true,
                        }),
                        macaroon: Value.text({
                          name: 'Macaroon',
                          required: {
                            default: null,
                          },
                          description:
                            'Your Core Lightning REST access.macaroon file, Base64URL encoded.',
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
