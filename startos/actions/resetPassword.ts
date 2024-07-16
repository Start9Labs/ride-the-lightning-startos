import { sdk } from '../sdk'
import { randomPassword } from '../utils'
import { rtlConfig } from '../file-models/RTL-Config.json'

const { Config, Value } = sdk

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

export const resetPassword = sdk.createAction(
  'resetPassword',
  {
    name: 'Reset Password',
    description: 'Resets your password to the one provided',
    warning: null,
    disabled: false,
    input,
    allowedStatuses: 'onlyStopped',
    group: null,
  },
  async ({ effects, input }) => {
    const password = input.password

    // Save password in RTL-config.json
    const config = (await rtlConfig.read(effects))!
    config.multiPass = password
    config.multiPassHashed = ''
    await rtlConfig.write(config, effects)

    // Save password to Store
    await sdk.store.setOwn(effects, sdk.StorePath.password, password)

    return {
      message: 'Password changed successfully.',
      value: {
        value: password,
        copyable: true,
        qr: false,
      },
    }
  },
)