import { sdk } from './sdk'
import { exposedStore, initStore } from './store'
import { setDependencies } from './dependencies'
import { setInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'
import { rtlConfig } from './file-models/RTL-Config.json'
import { configDefaults } from './utils'
import { resetPassword } from './actions/resetPassword'
import { setNodes } from './actions/setNodes'

// **** PreInstall ****
const preInstall = sdk.setupPreInstall(async ({ effects }) => {
  await rtlConfig.write(effects, configDefaults)
})

// **** PostInstall ****
const postInstall = sdk.setupPostInstall(async ({ effects }) => {
  await Promise.all([
    sdk.action.requestOwn(effects, resetPassword, 'critical', {
      reason: 'Set your RTL password',
    }),
    sdk.action.requestOwn(effects, setNodes, 'critical', {
      reason: 'Choose which nodes RTL will manage',
    }),
  ])
})

// **** Uninstall ****
const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  preInstall,
  postInstall,
  uninstall,
  setInterfaces,
  setDependencies,
  actions,
  initStore,
  exposedStore,
)
