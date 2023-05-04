import { setupManifest } from '@start9labs/start-sdk/lib/manifest/setupManifest'
import { actionsMetadata } from './procedures/actions'

/**
 * In this function you define static properties of the service
 */
export const manifest = setupManifest({
  id: 'ride-the-lightning',
  title: 'Ride The Lightning',
  version: '0.13.6.2',
  releaseNotes: `
* Update for StartOS 0.4.0
`,
  license: 'mit',
  replaces: Array<string>(),
  wrapperRepo: 'https://github.com/Start9Labs/ride-the-lightning-wrapper/',
  upstreamRepo: 'https://github.com/Ride-The-Lightning/RTL/',
  supportSite: 'https://github.com/Ride-The-Lightning/RTL/issues/',
  marketingSite: 'https://ridethelightning.info/',
  donationUrl: null,
  description: {
    short: 'A powerful tool to help manage your lightning node',
    long: 'A full function, device agnostic, web user interface for managing lightning node operations. Send payments, create invoices to receive, control outgoing channels for payments, query payment routes. RTL uses the LND and/or CLN nodes running on your server.',
  },
  assets: {
    license: 'LICENSE',
    icon: 'assets/icon.png',
    instructions: 'assets/instructions.md',
  },
  volumes: {
    // This is the image where files from the project asset directory will go
    main: 'data',
    lnd: 'pointer',
    cln: 'pointer',
  },
  containers: {
    main: {
      // Identifier for the main image volume, which will be used when other actions need to mount to this volume.
      image: 'main',
      // Specifies where to mount the data volume(s), if there are any. Mounts for pointer dependency volumes are also denoted here. These are necessary if data needs to be read from / written to these volumes.
      mounts: {
        // Specifies where on the service's file system its persistence directory should be mounted prior to service startup
        main: '/root',
        lnd: '/mnt/lnd',
        cln: '/mnt/c-lightning',
      },
    },
  },
  actions: actionsMetadata,
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    lnd: {
      version: '>=0.13.4 <0.17.0',
      description: 'Used to communicate with the Lightning Network',
      requirement: {
        type: 'opt-in',
        how: 'Enable LND in config settings',
      },
    },
    'c-lightning': {
      version: '>=0.10.1 <24.0.0',
      description: 'Used to communicate with the Lightning Network',
      requirement: {
        type: 'opt-in',
        how: 'Enable Core Lightning (CLN) in config settings',
      },
    },
  },
})

export type Manifest = typeof manifest
