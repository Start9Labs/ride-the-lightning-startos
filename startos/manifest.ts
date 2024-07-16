import { setupManifest } from '@start9labs/start-sdk'

/**
 * Here we define static properties of the package to be displayed in the Marketplace and used by StartOS.
 */
export const manifest = setupManifest({
  id: 'ride-the-lightning',
  title: 'Ride The Lightning',
  version: '0.15.2-beta:0',
  satisfies: null,
  releaseNotes: 'Updated for 0.3.6',
  license: 'mit',
  replaces: [], // A list of SaaS services/products this service is intended to replace
  wrapperRepo: 'https://github.com/Start9Labs/ride-the-lightning-wrapper',
  upstreamRepo: 'https://github.com/Ride-The-Lightning/RTL',
  supportSite: 'https://github.com/Ride-The-Lightning/RTL/issues',
  marketingSite: 'https://twitter.com/RTL_App',
  donationUrl: 'https://www.ridethelightning.info/donate/',
  description: {
    short: 'A full function, device agnostic, web user interface for managing lightning node operations',
    long: 'A full function, device agnostic, web user interface for managing lightning node operations. It talks directly to the LND or CLN node running on your StartOS server and is accessible from any Tor-enabled Browser!',
  },
  assets: [], // directories of static files you want to mount to your container
  volumes: ['main'], // IDs of persistence volumes that will be mounted to your container
  images: {
    main: {
      source: {
        dockerTag: "shahanafarooqui/rtl:v0.15.2"
      },
    },
  }, // IDs of images, used when other actions need to run in this image
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
      optional: true, // change to true to make Hello World a conditional dependency
    },
    'c-lightning': {
      description: 'Needed to communicate with the Lightning Network.',
      optional: true, // change to true to make Hello World a conditional dependency
    },
  },
})
