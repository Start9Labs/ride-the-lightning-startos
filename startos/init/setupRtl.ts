import { resetPassword } from '../actions/resetPassword'
import { setNodes } from '../actions/setNodes'
import { sdk } from '../sdk'

export const setupRtl = sdk.setupOnInit(async (effects) => {
  await Promise.all([
    sdk.action.createOwnTask(effects, resetPassword, 'critical', {
      reason: 'Set your RTL password',
    }),
    sdk.action.createOwnTask(effects, setNodes, 'critical', {
      reason: 'Choose which nodes RTL will manage',
    }),
  ])
})
