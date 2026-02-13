import { setupManifest } from '@start9labs/start-sdk'
import { short, long } from './i18n'

export const manifest = setupManifest({
  id: 'ride-the-lightning',
  title: 'Ride The Lightning',
  license: 'mit',
  wrapperRepo: 'https://github.com/Start9Labs/ride-the-lightning-startos',
  upstreamRepo: 'https://github.com/Ride-The-Lightning/RTL',
  supportSite: 'https://github.com/Ride-The-Lightning/RTL/issues',
  marketingSite: 'https://ridethelightning.info/',
  donationUrl: 'https://ridethelightning.info/donate/',
  docsUrl: 'https://github.com/Ride-The-Lightning/RTL/wiki',
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
      description: 'Optionally connect RTL to your CLN node.',
      optional: true,
      metadata: {
        title: 'Core Lightning',
        icon: 'https://github.com/Start9Labs/cln-startos/blob/master/icon.png?raw=true',
      },
    },
    lnd: {
      description: 'Optionally connect RTL to your LND node.',
      optional: true,
      metadata: {
        title: 'LND',
        icon: 'https://github.com/Start9Labs/lnd-startos/blob/master/icon.png?raw=true',
      },
    },
  },
})
