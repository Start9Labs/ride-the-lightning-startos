import { resetPassword } from '../actions/resetPassword'
import { setNodes } from '../actions/setNodes'
import { rtlConfig } from '../fileModels/RTL-Config.json'
import { sdk } from '../sdk'

export const taskInit = sdk.setupOnInit(async (effects, kind) => {
  const hasNodes = await rtlConfig.read((c) => c.nodes.length).const(effects)

  if (!hasNodes) {
    await sdk.action.createOwnTask(effects, setNodes, 'critical', {
      reason: 'Choose which nodes RTL will manage',
    })
  }

  if (kind === 'install') {
    await sdk.action.createOwnTask(effects, resetPassword, 'critical', {
      reason: 'Create a password for the RTL web interface',
    })
  }
})
