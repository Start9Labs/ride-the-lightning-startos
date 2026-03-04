import { rtlConfig } from '../fileModels/RTL-Config.json'
import { sdk } from '../sdk'
import { setNodes } from '../actions/setNodes'

export const taskSetNodes = sdk.setupOnInit(async (effects) => {
  const nodes = await rtlConfig.read((c) => c.nodes).const(effects)
  if (!nodes?.length) {
    await sdk.action.createOwnTask(effects, setNodes, 'critical', {
      reason: 'Choose which nodes RTL will manage',
    })
  }
})
