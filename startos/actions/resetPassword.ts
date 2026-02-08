import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { rtlConfig } from '../fileModels/RTL-Config.json'

export const resetPassword = sdk.Action.withoutInput(
  // id
  'reset-password',

  // metadata
  async ({ effects }) => {
    const config = await rtlConfig.read().const(effects)
    const hasPass = config?.multiPassHashed

    return {
      name: hasPass ? 'Reset Password' : 'Create Password',
      description: hasPass ? 'Reset your user interface password' : 'Create your user interface password',
      warning: 'Create new password?',
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  // the execution function
  async ({ effects }) => {
    const password = utils.getDefaultString({
      charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
      len: 22,
    })

    await rtlConfig.merge(effects, { multiPass: password, multiPassHashed: '' })

    return {
      version: '1',
      title: 'Success',
      message: 'Your new password is below. Save it to a password manager.',
      result: {
        type: 'single',
        value: password,
        masked: true,
        copyable: true,
        qr: false,
      },
    }
  },
)
