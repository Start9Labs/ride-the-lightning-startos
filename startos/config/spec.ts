import { sdk } from '../sdk'
const { Config } = sdk

/**
 * Here we define the config spec that will ultimately present to the user as validated form inputs.
 *
 * Most form controls are available, including text, textarea, number, toggle, select, multiselect, list, color, datetime, object ("sub form"), and union (conditional "sub forms").
 *
 * See Hello World for an example.
 */
export const configSpec = Config.of({})
