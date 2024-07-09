import { sdk } from '../sdk'
import { setInterfaces } from '../interfaces'
import { setDependencies } from '../dependencies/dependencies'
import { configSpec } from './spec'

/**
 * This function executes on config save.
 *
 * Use it to persist config data to various files and to establish any resulting dependencies.
 *
 * See Hello World for an example.
 */
export const save = sdk.setupConfigSave(
  configSpec,
  async ({ effects, input }) => {
    return {
      interfacesReceipt: await setInterfaces({ effects, input }), // Plumbing. DO NOT EDIT. This line causes setInterfaces() to run whenever config is saved.
      dependenciesReceipt: await setDependencies({ effects, input }), // Plumbing. DO NOT EDIT.
      restart: true, // optionally restart the service on config save.
    }
  },
)
