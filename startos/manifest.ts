import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'ride-the-lightning',
  title: 'Ride The Lightning',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/ride-the-lightning-wrapper',
  upstreamRepo: 'https://github.com/Ride-The-Lightning/RTL',
  supportSite: 'https://github.com/Ride-The-Lightning/RTL/issues',
  marketingSite: 'https://ridethelightning.info/',
  donationUrl: 'https://ridethelightning.info/donate/',
  description: {
    short: 'A web user interface for managing lightning nodes',
    long: 'A full function, device agnostic, web user interface for managing lightning nodes. RTL connects directly to your StartOS LND and/or CLN node and is accessible from any browser.',
  },
  volumes: ['main'],
  images: {
    rtl: {
      source: {
        dockerTag: 'shahanafarooqui/rtl:v0.15.2',
      },
    },
  },
  hardwareRequirements: {},
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    'c-lightning': {
      description: 'Optionally connect RTL to your CLN node.',
      optional: true,
      s9pk: 'https://github.com/Start9Labs/cln-startos/releases/download/v25.02.2/c-lightningV2.s9pk',
    },
    lnd: {
      description: 'Optionally connect RTL to your LND node.',
      optional: true,
      s9pk: 'https://github.com/Start9Labs/lnd-startos/releases/download/v0.19.1-beta.1-alpha.0/lnd.s9pk',
    },
  },
})
