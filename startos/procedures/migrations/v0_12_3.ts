import { Migration } from '@start9labs/start-sdk/lib/inits/migrations/Migration'

export const v0_12_3 = new Migration({
  version: '0.12.3',
  up: async ({ effects }) => {
    effects.runCommand(['rm', '-rf', '/root/lnd-external'])
  },
  down: async ({ effects }) => {
    throw new Error('Downgrade not permitted')
  },
})
