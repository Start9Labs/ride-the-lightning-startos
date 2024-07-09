import { sdk } from '../sdk'
import { configSpec } from './spec'

/**
 * This function executes on config read.
 *
 * Use this function to gather data from various files and assemble into a valid config to display to the user.
 *
 * See Hello World for an example.
 */
export const read = sdk.setupConfigRead(configSpec, async ({ effects }) => {})
