import { sdk } from '../sdk'
import { migrations } from './migrations'
import { rtlConfig } from './config/file-models/RTL-Config.json'
import { getDefaultString } from '@start9labs/start-sdk/lib/util/getDefaultString'
import { randomPassword } from '../utils'
import { setInterfaces, uiPort } from './interfaces'

const install = sdk.setupInstall(async ({ effects, utils }) => {
  // generate random password
  const password = getDefaultString(randomPassword)
  // Save password to vault
  await utils.store.setOwn('/password', password)
  // create RTL config file with defaults
  await rtlConfig.write(
    {
      SSO: {},
      nodes: [],
      host: '0.0.0.0',
      port: uiPort,
      multiPass: password,
      multiPassHashed: '',
      secret2fa: '',
    },
    effects,
  )
})

const uninstall = sdk.setupUninstall(async ({ effects, utils }) => {})

const exportedValues = sdk.setupExports(({ effects, utils }) => {
  return {
    ui: [
      {
        title: 'Password',
        path: '/password',
      },
    ],
    services: [],
  }
})

export const { init, uninit } = sdk.setupInit(
  migrations,
  install,
  uninstall,
  setInterfaces,
  exportedValues,
)
