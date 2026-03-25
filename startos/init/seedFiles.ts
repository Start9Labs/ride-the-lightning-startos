import { rtlConfig } from '../fileModels/RTL-Config.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects) => {
  await rtlConfig.merge(effects, {})
})
