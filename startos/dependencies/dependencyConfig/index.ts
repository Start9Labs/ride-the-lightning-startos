import { sdk } from '../../sdk'
import { configSpec } from '../../config/spec'
import { clnConfig } from './cln'

export const dependencyConfig = sdk.setupDependencyConfig(configSpec, {
  'c-lightning': clnConfig,
})
