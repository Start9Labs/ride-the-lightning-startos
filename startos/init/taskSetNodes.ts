import { resetPassword } from '../actions/resetPassword'
import { setNodes } from '../actions/setNodes'
import { rtlConfig } from '../fileModels/RTL-Config.json'
import { sdk } from '../sdk'

export const taskInit = sdk.setupOnInit(async (effects) => {
  const config = await rtlConfig.read().const(effects)

  if (!config?.nodes.length) {
    await sdk.action.createOwnTask(effects, setNodes, 'critical', {
      reason: 'Choose which nodes RTL will manage',
    })
  }

  if (!config?.multiPassHashed && !config?.multiPass) {
    await sdk.action.createOwnTask(effects, resetPassword, 'critical', {
      reason: 'Create a password for the RTL web interface',
    })
  }
})
