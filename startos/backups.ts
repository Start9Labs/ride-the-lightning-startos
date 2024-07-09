import { sdk } from './sdk'

/**
 * Here we define which volumes to back up, including advanced options.
 */

/**
 * This example backs up the entire "main" volume.
 *
 * See Hello World for additional examples.
 */
export const { createBackup, restoreBackup } = sdk.setupBackups(
  sdk.Backups.volumes('main'),
)
