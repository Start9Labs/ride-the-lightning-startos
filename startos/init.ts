import { sdk } from './sdk'
import { exposedStore } from './store'
import { setDependencies } from './dependencies/dependencies'
import { setInterfaces } from './interfaces'
import { utils } from '@start9labs/start-sdk'
import { migrations } from './migrations'
import { randomPassword } from './utils'

/**
 * Here you define arbitrary code that runs *once*, on fresh install only.
 *
 * See Hello World for an example.
 */
const install = sdk.setupInstall(async ({ effects }) => {
  // generate random password
  const password = utils.getDefaultString(randomPassword)
  // Save password to store
  await sdk.store.setOwn(effects, sdk.StorePath.password, password)
})

/**
 * Here we define arbitrary code that runs once, on uninstall only.
 */
const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { init, uninit } = sdk.setupInit(
  migrations,
  install,
  uninstall,
  setInterfaces,
  setDependencies,
  exposedStore,
)
