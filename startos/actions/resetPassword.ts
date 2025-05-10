import { utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { rtlConfig } from '../file-models/RTL-Config.json'
import { store } from '../file-models/store.json'

export const resetPassword = sdk.Action.withoutInput(
  // id
  'reset-password',

  // metadata
  async ({ effects }) => {
    const hasPass = await store.read((s) => s.hassPassword).const(effects)
    const desc = 'your user interface password'

    return {
      name: hasPass ? 'Reset Password' : 'Create Password',
      description: hasPass ? `Reset ${desc}` : `Create ${desc}`,
      warning: null,
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
