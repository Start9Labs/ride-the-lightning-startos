import { resetPassword } from '../actions/resetPassword'
import { setNodes } from '../actions/setNodes'
import { rtlConfig } from '../file-models/RTL-Config.json'
import { sdk } from '../sdk'

export const monitorConfig = sdk.setupOnInit(async (effects) => {
  const config = await rtlConfig
    .read((c) => ({ multiPassHashed: c.multiPassHashed, nodes: c.nodes }))
    .const(effects)

  if (!config?.multiPassHashed) {
    await sdk.action.createOwnTask(effects, resetPassword, 'critical', {
      reason: 'Set your RTL password',
    })
  }

  if (!config?.nodes.length) {
    await sdk.action.createOwnTask(effects, setNodes, 'critical', {
      reason: 'Choose which nodes RTL will manage',
    })
  }
})
