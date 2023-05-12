import { sdk } from '../sdk'
import { migrations } from './migrations'
import { rtlConfig } from './config/file-models/RTL-Config.json'
import { getDefaultString } from '@start9labs/start-sdk/lib/util/getDefaultString'
import { randomPassword } from '../utils'
import { setInterfaces } from './interfaces'

const install = sdk.setupInstall(async ({ effects, utils }) => {
  // generate random password
  const password = getDefaultString(randomPassword)
  // Save password to vault
  await effects.vault.set({ key: 'password', value: password })
  // create RTL config file with defaults
  await rtlConfig.write(
    {
      SSO: {},
      nodes: [],
      host: '0.0.0.0',
      port: 80,
      multiPass: password,
      multiPassHashed: '',
      secret2fa: '',
    },
    effects,
  )
})

const uninstall = sdk.setupUninstall(async ({ effects, utils }) => {})

export const { init, uninit } = sdk.setupInit(
  migrations,
  install,
  uninstall,
  setInterfaces,
)
