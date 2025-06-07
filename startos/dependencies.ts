import { T } from '@start9labs/start-sdk'
import { rtlConfig } from './file-models/RTL-Config.json'
import { sdk } from './sdk'
import { hasInternal } from './utils'
import { manifest } from './manifest'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  const nodes = (await rtlConfig.read((c) => c.nodes).const(effects))!

  const deps = {} as T.CurrentDependenciesResult<typeof manifest>

  if (hasInternal(nodes, 'lnd')) {
    deps.lnd = {
      kind: 'exists',
      versionRange: '>0.18.5',
    }
  }

  if (hasInternal(nodes, 'c-lightning')) {
    deps['c-lightning'] = {
      kind: 'exists',
      // @TODO
      versionRange: '',
    }
  }

  return deps
})
