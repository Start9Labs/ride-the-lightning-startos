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
    name: 'New Password',
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
export const resetPassword = createAction<WrapperData, typeof input>(
  {
    name: 'Reset Password',
    description: 'Resets your password to the one provided',
    id: 'resetPassword',
    input,
    allowedStatuses: 'only-stopped',
  },
  async ({ effects, utils, input }) => {
    const password = input.password

    // Save password to vault
    await effects.vault.set({ key: 'password', value: password })

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
