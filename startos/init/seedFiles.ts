import { rtlConfig } from '../fileModels/RTL-Config.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return
  await rtlConfig.merge(effects, {})
})
