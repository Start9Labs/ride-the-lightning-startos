import { sdk } from '../../../sdk'
import { configSpec } from '../../config/spec'
import { configSpec as clnSpec } from 'c-lightning-wrapper/startos/procedures/config/spec'

export const clnConfig = sdk.DependencyConfig.of({
  localConfig: configSpec,
  remoteConfig: clnSpec,
  dependencyConfig: async ({ effects, utils, localConfig, remoteConfig }) => {
    return {
      advanced: {
        plugins: {
          rest: true,
        },
      },
    }
  },
})
