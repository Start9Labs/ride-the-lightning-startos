import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'ride-the-lightning',
  title: 'Ride The Lightning',
  version: '0.15.2-beta:0',
  satisfies: null,
  releaseNotes: 'Updated for 0.3.6',
  license: 'mit',
  replaces: [],
  wrapperRepo: 'https://github.com/Start9Labs/ride-the-lightning-wrapper',
  upstreamRepo: 'https://github.com/Ride-The-Lightning/RTL',
  supportSite: 'https://github.com/Ride-The-Lightning/RTL/issues',
  marketingSite: 'https://twitter.com/RTL_App',
  donationUrl: 'https://www.ridethelightning.info/donate/',
  description: {
    short: 'A full function, device agnostic, web user interface for managing lightning node operations',
    long: 'A full function, device agnostic, web user interface for managing lightning node operations. It talks directly to the LND or CLN node running on your StartOS server and is accessible from any Tor-enabled Browser!',
  },
  assets: [],
  volumes: ['main'],
  images: {
    main: {
      source: {
        dockerTag: "shahanafarooqui/rtl:v0.15.2"
      },
    },
  },
  hardwareRequirements: null,
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    'lnd': {
      description: 'Needed to communicate with the Lightning Network.',
      optional: true,
    },
    'c-lightning': {
      description: 'Needed to communicate with the Lightning Network.',
      optional: true,
    },
  },
})
