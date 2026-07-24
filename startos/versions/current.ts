import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.9:2',
  releaseNotes: {
    en_US: `Keeps the LND connection working when LND changes how it serves TLS.

Ride The Lightning resolved its nodes' addresses from a field that is only populated for one of the two ways a service can publish a port. It now reads the address itself, which is correct either way — so an internal LND or Core Lightning node survives its next update instead of going unreachable.`,
    es_ES: `Mantiene la conexión con LND cuando LND cambia su forma de servir TLS.

Ride The Lightning resolvía las direcciones de sus nodos a partir de un campo que solo se rellena en una de las dos formas en que un servicio puede publicar un puerto. Ahora lee la dirección en sí, que es correcta en ambos casos, así que un nodo interno de LND o Core Lightning sobrevive a su próxima actualización en lugar de quedar inaccesible.`,
    de_DE: `Hält die LND-Verbindung aufrecht, wenn LND die Art der TLS-Bereitstellung ändert.

Ride The Lightning ermittelte die Adressen seiner Knoten aus einem Feld, das nur bei einer der beiden Arten gefüllt ist, auf die ein Dienst einen Port veröffentlichen kann. Jetzt wird die Adresse selbst gelesen, die in beiden Fällen stimmt — ein interner LND- oder Core-Lightning-Knoten übersteht damit sein nächstes Update, statt unerreichbar zu werden.`,
    pl_PL: `Utrzymuje połączenie z LND, gdy LND zmienia sposób udostępniania TLS.

Ride The Lightning ustalał adresy swoich węzłów na podstawie pola wypełnianego tylko przy jednym z dwóch sposobów publikowania portu przez usługę. Teraz odczytuje sam adres, poprawny w obu przypadkach — dzięki temu wewnętrzny węzeł LND lub Core Lightning przetrwa kolejną aktualizację, zamiast stać się nieosiągalny.`,
    fr_FR: `Maintient la connexion à LND lorsque LND change sa façon de servir TLS.

Ride The Lightning déterminait les adresses de ses nœuds à partir d'un champ renseigné dans un seul des deux modes de publication d'un port par un service. Il lit désormais l'adresse elle-même, correcte dans les deux cas — un nœud LND ou Core Lightning interne survit donc à sa prochaine mise à jour au lieu de devenir injoignable.`,
  },
  migrations: {},
})
