import { sdk } from '../../sdk'
import { randomPassword } from '../../utils'
import { rtlConfig } from '../config/file-models/RTL-Config.json'

const { Config, Value } = sdk

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
export const resetPassword = sdk.createAction(
  {
    name: 'Reset Password',
    description: 'Resets your password to the one provided',
    id: 'resetPassword',
    input,
    allowedStatuses: 'only-stopped',
  },
  async ({ effects, utils, input }) => {
    const password = input.password

    // Save password in RTL-config.json
    const config = (await rtlConfig.read(effects))!
    config.multiPass = password
    config.multiPassHashed = ''
    await rtlConfig.write(config, effects)

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
