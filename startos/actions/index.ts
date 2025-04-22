import { sdk } from '../sdk'
import { resetPassword } from './resetPassword'
import { setNodes } from './setNodes'

export const actions = sdk.Actions.of()
  .addAction(resetPassword)
  .addAction(setNodes)
