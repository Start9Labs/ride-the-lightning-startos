import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { configDefaults } from '../utils'
import { store } from '../file-models/store.json'
import { rtlConfig } from '../file-models/RTL-Config.json'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    await rtlConfig.write(effects, configDefaults)
  },
})
