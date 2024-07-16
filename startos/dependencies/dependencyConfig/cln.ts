import { sdk } from '../../sdk'
import { configSpec } from '../../config/spec'
import { configSpec as clnSpec } from 'c-lightning-startos/startos/config/spec'

export const clnConfig = sdk.DependencyConfig.of({
  localConfigSpec: configSpec,
  remoteConfigSpec: clnSpec,
  dependencyConfig: async ({ effects, localConfig }) => {
    return {
      advanced: {
        plugins: {
          clnrest: true
        }
      }
    }
  },
})
