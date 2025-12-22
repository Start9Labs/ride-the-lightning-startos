import { VersionGraph } from '@start9labs/start-sdk'
import { current, other } from './versions'
import { configDefaults } from '../utils'
import { rtlConfig } from '../fileModels/RTL-Config.json'

export const versionGraph = VersionGraph.of({
  current,
  other,
  preInstall: async (effects) => {
    await rtlConfig.write(effects, configDefaults)
  },
})
