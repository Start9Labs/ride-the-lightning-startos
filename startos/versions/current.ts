import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.13:0',
  releaseNotes: {
    en_US: `Updated Ride The Lightning to 0.15.13.

- Removes the Boltz swap pages, since Boltz has suspended its swap service
- Fixes "Invalid CSRF token" on the first login
- LND: wallets can be initialised with any seed passphrase
- Loop: on a multi-node setup, each request goes to the selected node's swap server

[Full release notes](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.13)`,
    es_ES: `Ride The Lightning actualizado a 0.15.13.

- Elimina las páginas de intercambios de Boltz, ya que Boltz ha suspendido su servicio de intercambios
- Corrige el error "Invalid CSRF token" en el primer inicio de sesión
- LND: las carteras se pueden inicializar con cualquier frase de contraseña de la semilla
- Loop: en una configuración con varios nodos, cada solicitud va al servidor de intercambios del nodo seleccionado

[Notas de la versión completas](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.13)`,
    de_DE: `Ride The Lightning wurde auf 0.15.13 aktualisiert.

- Entfernt die Boltz-Swap-Seiten, da Boltz seinen Swap-Dienst eingestellt hat
- Behebt "Invalid CSRF token" bei der ersten Anmeldung
- LND: Wallets lassen sich mit jeder Seed-Passphrase initialisieren
- Loop: Bei mehreren Knoten geht jede Anfrage an den Swap-Server des ausgewählten Knotens

[Vollständige Versionshinweise](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.13)`,
    pl_PL: `Zaktualizowano Ride The Lightning do wersji 0.15.13.

- Usuwa strony wymian Boltz, ponieważ Boltz zawiesił swoją usługę wymian
- Naprawia błąd "Invalid CSRF token" przy pierwszym logowaniu
- LND: portfele można inicjalizować z dowolnym hasłem do seeda
- Loop: przy wielu węzłach każde żądanie trafia do serwera wymian wybranego węzła

[Pełne informacje o wydaniu](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.13)`,
    fr_FR: `Ride The Lightning a été mis à jour vers la version 0.15.13.

- Supprime les pages d'échange Boltz, Boltz ayant suspendu son service d'échange
- Corrige l'erreur « Invalid CSRF token » lors de la première connexion
- LND : les portefeuilles peuvent être initialisés avec n'importe quelle phrase secrète de la graine
- Loop : sur une configuration à plusieurs nœuds, chaque requête est envoyée au serveur d'échange du nœud sélectionné

[Notes de version complètes](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.13)`,
  },
  migrations: {},
})
