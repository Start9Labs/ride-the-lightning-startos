import { T } from '@start9labs/start-sdk'
import { rtlConfig } from './file-models/RTL-Config.json'
import { sdk } from './sdk'
import { hasInternal } from './utils'
import { manifest } from './manifest'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const nodes = await rtlConfig.read((c) => c.nodes).const(effects)
  if (!nodes) throw new Error('nodes not found in config file')

  const deps = {} as T.CurrentDependenciesResult<typeof manifest>

  if (hasInternal(nodes, 'lnd')) {
    deps.lnd = {
      kind: 'exists',
      versionRange: '>=0.19.1-beta:1-beta.1',
    }
  }

  if (hasInternal(nodes, 'c-lightning')) {
    deps['c-lightning'] = {
      kind: 'exists',
      versionRange: '>=25.5:1-alpha.1',
    }
  }

  return deps
})
