import { setupManifest } from '@start9labs/start-sdk/lib/manifest/setupManifest'

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
    main: 'data',
  },
  containers: {
    main: {
      image: 'main',
      mounts: {
        main: '/root',
      },
    },
  },
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
        how: 'Enable CLN in config settings',
      },
    },
  },
})

export type Manifest = typeof manifest
