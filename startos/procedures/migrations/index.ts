import { setupMigrations } from '@start9labs/start-sdk/lib/inits/migrations/setupMigrations'
import { manifest } from '../../manifest'
import { v0_13_6_2 } from './v0_13_6_2'
import { v0_12_3 } from './v0_12_3'

/**
 * Add each new migration as the next argument to this function
 */
export const migrations = setupMigrations(manifest, v0_12_3, v0_13_6_2)
