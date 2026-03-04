import { sdk } from '../sdk'
import { seedFiles } from './seedFiles'
import { taskSetNodes } from './taskSetNodes'
import { setDependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../install/versionGraph'
import { actions } from '../actions'
import { restoreInit } from '../backups'

export const init = sdk.setupInit(
  seedFiles,
  restoreInit,
  versionGraph,
  setInterfaces,
  setDependencies,
  actions,
  taskSetNodes,
)

export const uninit = sdk.setupUninit(versionGraph)
