import { resetPassword } from '../actions/resetPassword'
import { setNodes } from '../actions/setNodes'
import { rtlConfig } from '../file-models/RTL-Config.json'
import { sdk } from '../sdk'

export const monitorConfig = sdk.setupOnInit(async (effects) => {
  const nodes = await rtlConfig
    .read((c) => c.nodes.length)
    .const(effects)

  const hash = await rtlConfig.read((c) => c.multiPass).once()

  if (!hash) {
    await sdk.action.createOwnTask(effects, resetPassword, 'critical', {
      reason: 'Set your RTL password',
    })
  }

  if (!nodes) {
    await sdk.action.createOwnTask(effects, setNodes, 'critical', {
      reason: 'Choose which nodes RTL will manage',
    })
  }
})
