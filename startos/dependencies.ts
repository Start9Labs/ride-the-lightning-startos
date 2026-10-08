import { T } from '@start9labs/start-sdk'
import { plugins as clnPlugins } from 'cln-startos/startos/actions/config/plugins'
import { rtlConfig } from './fileModels/RTL-Config.json'
import {
  depClnDescription,
  depEclairDescription,
  depLndDescription,
} from './manifest/i18n'
import { sdk } from './sdk'
import { hasInternal } from './utils'

const configured =
  (imp: 'lnd' | 'c-lightning' | 'eclair') =>
  async ({ effects }: { effects: T.Effects }) =>
    (await rtlConfig.read((c) => hasInternal(c.nodes, imp)).const(effects)) ===
    true

export const dependencies = sdk.Dependencies.of()
  .addDependency(
    sdk.Dependency.optional('lnd', {
      description: depLndDescription,
      metadata: {
        title: 'LND',
        icon: 'https://raw.githubusercontent.com/Start9Labs/lnd-startos/6a24e93761aa9046d427d0e62021defcaf9b47f3/icon.svg',
      },
      versionRange: '>=0.21.1-beta:4',
      kind: 'running',
      healthChecks: ['lnd'],
      enabled: configured('lnd'),
    }),
  )
  .addDependency(
    sdk.Dependency.optional('c-lightning', {
      description: depClnDescription,
      metadata: {
        title: 'Core Lightning',
        icon: 'https://raw.githubusercontent.com/Start9Labs/cln-startos/71b2d1eb78e2d31cc4d62a410512422d39e856e9/icon.svg',
      },
      versionRange: '>=26.6.6:1',
      kind: 'running',
      healthChecks: ['lightningd'],
      enabled: configured('c-lightning'),
    }).withInit(async (effects) => {
      await sdk.action.createTask(
        effects,
        'c-lightning',
        clnPlugins,
        'critical',
        {
          input: {
            kind: 'partial',
            accept: [{ clnrest: true }],
            set: { clnrest: true },
          },
          reason: 'RTL requires CLNrest enabled in Core Lightning',
          when: { condition: 'input-not-matches', once: false },
        },
      )
    }),
  )
  .addDependency(
    sdk.Dependency.optional('eclair', {
      description: depEclairDescription,
      metadata: {
        title: 'Eclair',
        icon: 'https://raw.githubusercontent.com/Start9Labs/eclair-startos/master/icon.png',
      },
      versionRange: '>=0.14.2:0',
      kind: 'running',
      healthChecks: ['eclair'],
      enabled: configured('eclair'),
    }),
  )
