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
    short: {
      en_US: 'A web user interface for managing lightning nodes',
      es_ES: 'Una interfaz web de usuario para administrar nodos lightning',
      de_DE: 'Eine Weboberfläche zur Verwaltung von Lightning-Knoten',
      pl_PL: 'Interfejs webowy użytkownika do zarządzania węzłami lightning',
      fr_FR: 'Une interface web utilisateur pour gérer les nœuds lightning',
    },
    long: {
      en_US:
        'A full function, device agnostic, web user interface for managing lightning nodes. RTL connects directly to your StartOS LND and/or CLN node and is accessible from any browser.',
      es_ES:
        'Una interfaz web de usuario completa, independiente del dispositivo, para administrar nodos lightning. RTL se conecta directamente a tu nodo LND y/o CLN de StartOS y es accesible desde cualquier navegador.',
      de_DE:
        'Eine voll funktionsfähige, geräteunabhängige Weboberfläche zur Verwaltung von Lightning-Knoten. RTL verbindet sich direkt mit Ihrem StartOS LND- und/oder CLN-Knoten und ist von jedem Browser aus zugänglich.',
      pl_PL:
        'Pełnofunkcyjny, niezależny od urządzenia interfejs webowy użytkownika do zarządzania węzłami lightning. RTL łączy się bezpośrednio z twoim węzłem LND i/lub CLN StartOS i jest dostępny z każdej przeglądarki.',
      fr_FR:
        "Une interface web utilisateur complète et indépendante de l'appareil pour gérer les nœuds lightning. RTL se connecte directement à votre nœud LND et/ou CLN StartOS et est accessible depuis n'importe quel navigateur.",
    },
  },
  volumes: ['main'],
  images: {
    rtl: {
      source: {
        dockerTag: 'shahanafarooqui/rtl:v0.15.6',
      },
      arch: ['x86_64', 'aarch64'],
      emulateMissingAs: 'aarch64',
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
