import { WrapperData } from '../wrapperData'
import { migrations } from './migrations'
import { rtlConfig } from './config/file-models/RTL-Config.json'
import { setupInstall } from '@start9labs/start-sdk/lib/inits/setupInstall'
import { setupUninstall } from '@start9labs/start-sdk/lib/inits/setupUninstall'
import { setupInit } from '@start9labs/start-sdk/lib/inits/setupInit'
import { getDefaultString } from '@start9labs/start-sdk/lib/util/getDefaultString'
import { randomPassword } from '../utils'

/**
 * Here you define arbitrary code that runs once, on fresh install only
 */
const install = setupInstall<WrapperData>(async ({ effects, utils }) => {
  // generate random password
  const password = getDefaultString(randomPassword)
  // Save password to vault
  await effects.vault.set({ key: 'password', value: password })
  // create RTL config file with defaults
  await rtlConfig.write(
    {
      default_node_index: 1,
      SSO: {
        logout_redirect_link: '',
        rtl_cookie_path: '',
        rtl_s_s_o: 0,
      },
      nodes: [],
      host: '0.0.0.0',
      port: 80,
      multi_pass: password,
      // @TODO test if these are needed
      multi_pass_hashed: undefined,
      secret_2fa: undefined,
    },
    effects,
  )
})

/**
 * Here you define arbitrary code that runs once, on uninstall only
 */
const uninstall = setupUninstall<WrapperData>(async ({ effects, utils }) => {})

/**
 * This is a static function. There is no need to make changes here
 */
export const { init, uninit } = setupInit(migrations, install, uninstall)
