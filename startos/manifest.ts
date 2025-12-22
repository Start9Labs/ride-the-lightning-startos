import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'ride-the-lightning',
  title: 'Ride The Lightning',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/ride-the-lightning-startos',
  upstreamRepo: 'https://github.com/Ride-The-Lightning/RTL',
  supportSite: 'https://github.com/Ride-The-Lightning/RTL/issues',
  marketingSite: 'https://ridethelightning.info/',
  donationUrl: 'https://ridethelightning.info/donate/',
  docsUrl:
    'https://github.com/Start9Labs/ride-the-lightning-startos/instructions.md',
  description: {
    short: 'A web user interface for managing lightning nodes',
    long: 'A full function, device agnostic, web user interface for managing lightning nodes. RTL connects directly to your StartOS LND and/or CLN node and is accessible from any browser.',
  },
  volumes: ['main'],
  images: {
    rtl: {
      source: {
        dockerTag: 'shahanafarooqui/rtl:v0.15.5',
      },
    },
  },
  dependencies: {
    'c-lightning': {
      description: 'Optionally connect RTL to your CLN node.',
      optional: true,
      metadata: {
        title: 'Core Lightning',
        icon: 'https://github.com/Start9Labs/cln-startos/blob/master/icon.png',
      },
    },
    lnd: {
      description: 'Optionally connect RTL to your LND node.',
      optional: true,
      metadata: {
        title: 'LND',
        icon: 'https://github.com/Start9Labs/lnd-startos/blob/master/icon.png',
      },
    },
  },
})
