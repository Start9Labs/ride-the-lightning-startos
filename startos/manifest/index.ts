import { setupManifest } from '@start9labs/start-sdk'
import { depClnDescription, depLndDescription, long, short } from './i18n'

export const manifest = setupManifest({
  id: 'ride-the-lightning',
  title: 'Ride The Lightning',
  license: 'mit',
  packageRepo:
    'https://github.com/Start9Labs/ride-the-lightning-startos',
  upstreamRepo: 'https://github.com/Ride-The-Lightning/RTL',
  marketingUrl: 'https://ridethelightning.info/',
  donationUrl: 'https://ridethelightning.info/donate/',
  docsUrls: ['https://github.com/Ride-The-Lightning/RTL'],
  description: { short, long },
  volumes: ['main'],
  images: {
    rtl: {
      source: {
        dockerTag: 'shahanafarooqui/rtl:v0.15.8',
      },
    },
  },
  dependencies: {
    'c-lightning': {
      description: depClnDescription,
      optional: true,
      metadata: {
        title: 'Core Lightning',
        icon: 'https://raw.githubusercontent.com/Start9Labs/cln-startos/71b2d1eb78e2d31cc4d62a410512422d39e856e9/icon.svg',
      },
    },
    lnd: {
      description: depLndDescription,
      optional: true,
      metadata: {
        title: 'LND',
        icon: 'https://raw.githubusercontent.com/Start9Labs/lnd-startos/6a24e93761aa9046d427d0e62021defcaf9b47f3/icon.svg',
      },
    },
  },
})
