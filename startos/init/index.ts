import { sdk } from '../sdk'
import { seedFiles } from './seedFiles'
import { taskSetNodes } from './taskSetNodes'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { restoreInit } from '../backups'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  seedFiles,
  setInterfaces,
  setDependencies,
  actions,
  taskSetNodes,
)

export const uninit = sdk.setupUninit(versionGraph)
