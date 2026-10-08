import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'ride-the-lightning',
  title: 'Ride The Lightning',
  license: 'mit',
  packageRepo: 'https://github.com/Start9Labs/ride-the-lightning-startos',
  upstreamRepo: 'https://github.com/Ride-The-Lightning/RTL',
  marketingUrl: 'https://ridethelightning.info/',
  donationUrl: 'https://ridethelightning.info/donate/',
  description: { short, long },
  volumes: ['main'],
  images: {
    rtl: {
      source: {
        dockerTag: 'shahanafarooqui/rtl:v0.15.13',
      },
      emulateMissing: false,
    },
  },
})
