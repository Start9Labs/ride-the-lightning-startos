import { sdk } from './sdk'

/**
 * Here we determine which values from the local Store and underlying service to expose in the UI in Properties.
 *
 * See Hello World for an example.
 */
export const properties = sdk.setupProperties(async ({ effects }) => {
  const store = await sdk.store.getOwn(effects, sdk.StorePath).once()

  return {
    'Secret Phrase': {
      type: 'string',
      value: store.password,
      description: 'Use this password to access the RTL web UI',
      copyable: true,
      qr: false,
      masked: true,
    },
  }
})
