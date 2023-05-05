import { Config } from '@start9labs/start-sdk/lib/config/builder/config'
import { WrapperData } from '../../wrapperData'
import { createAction } from '@start9labs/start-sdk/lib/actions/createAction'
import { Value } from '@start9labs/start-sdk/lib/config/builder/value'
import { randomPassword } from '../../utils'

/**
 * This is an example Action
 *
 * By convention, each action receives its own file
 *
 * Actions optionally take an arbitrary config form as input
 */
const input = Config.of({
  password: Value.text({
    name: 'Password',
    required: {
      default: randomPassword,
    },
    generate: randomPassword,
    masked: true,
  }),
})

/**
 * This function defines the Action, including the FormSpec (if any)
 *
 * The first argument is the Action metadata. The second argument is the Action function
 *
 * If no input is required, FormSpec would be null
 */
export const setPassword = createAction<WrapperData, typeof input>(
  {
    name: 'Set Password',
    description: 'Resets your password to the one provided',
    id: 'setPassword',
    input,
    allowedStatuses: 'only-stopped',
  },
  async ({ effects, utils, input }) => {
    return {
      message: 'Password changed successfully and saved to your Vault.',
      value: {
        value: input.password,
        copyable: true,
        qr: false,
      },
    }
  },
)