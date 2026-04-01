import { T } from '@start9labs/start-sdk'
import { rtlConfig } from './fileModels/RTL-Config.json'
import { manifest } from './manifest'
import { sdk } from './sdk'
import { hasInternal } from './utils'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const nodes =
    (await rtlConfig.read((c) => c.nodes || []).const(effects)) || []

  const deps = {} as T.CurrentDependenciesResult<typeof manifest>

  if (hasInternal(nodes, 'lnd')) {
    deps.lnd = {
      kind: 'running',
      versionRange: '>=0.20.1-beta:1',
      healthChecks: ['lnd'],
    }
  }

  if (hasInternal(nodes, 'c-lightning')) {
    deps['c-lightning'] = {
      kind: 'running',
      versionRange: '>=25.12.1:4',
      healthChecks: ['lightningd'],
    }
  }

  return deps
})
