import { sdk } from '../../sdk'
import { configSpec } from '../../config/spec'
import { configSpec as helloWorldSpec } from 'hello-world-startos/startos/config/spec'

/**
 * Here we establish rules for configuring a specific dependency.
 *
 * End user approval is required before changes are applied.
 */
export const helloWorldConfig = sdk.DependencyConfig.of({
  localConfigSpec: configSpec,
  remoteConfigSpec: helloWorldSpec,
  dependencyConfig: async ({ effects, localConfig }) => {
    return {
      name: 'Satoshi',
    }
  },
})
