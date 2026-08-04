import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.10:0',
  releaseNotes: {
    en_US: `Updated Ride The Lightning to 0.15.10.

A security-hygiene release. Login requests are validated more strictly — two-factor setups are the most affected — and credentials are no longer written to node logs or returned by the configuration API. Authentication settings are now fixed on the server so they cannot be changed through the settings API, and channel-backup downloads are confined to the selected node's backup directory. A node with many channels no longer fires one alias lookup per channel at once, and a race that could send a request with the wrong node's credentials is fixed. Upstream also cleared every known vulnerability in its production dependencies.

Full release notes: https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.10`,
    es_ES: `Se actualizó Ride The Lightning a 0.15.10.

Una versión centrada en la higiene de seguridad. Las solicitudes de inicio de sesión se validan de forma más estricta —las configuraciones con doble factor son las más afectadas— y las credenciales ya no se escriben en los registros de los nodos ni las devuelve la API de configuración. Los ajustes de autenticación quedan fijados en el servidor, de modo que no pueden cambiarse mediante la API de ajustes, y las descargas de copias de seguridad de canales se limitan al directorio de copias del nodo seleccionado. Un nodo con muchos canales ya no lanza una búsqueda de alias por canal a la vez, y se corrigió una condición de carrera que podía enviar una solicitud con las credenciales del nodo equivocado. Además, upstream resolvió todas las vulnerabilidades conocidas en sus dependencias de producción.

Notas de la versión completas: https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.10`,
    de_DE: `Ride The Lightning wurde auf 0.15.10 aktualisiert.

Eine Version zur Verbesserung der Sicherheitshygiene. Anmeldeanfragen werden strenger geprüft — Einrichtungen mit Zwei-Faktor-Authentifizierung sind am stärksten betroffen — und Zugangsdaten werden nicht mehr in Knoten-Logs geschrieben oder von der Konfigurations-API zurückgegeben. Authentifizierungseinstellungen sind jetzt serverseitig festgelegt und lassen sich nicht mehr über die Einstellungs-API ändern; Downloads von Kanal-Backups bleiben auf das Backup-Verzeichnis des ausgewählten Knotens beschränkt. Ein Knoten mit vielen Kanälen startet nicht mehr eine Alias-Abfrage pro Kanal gleichzeitig, und eine Race-Condition, die eine Anfrage mit den Zugangsdaten des falschen Knotens senden konnte, wurde behoben. Upstream hat außerdem alle bekannten Schwachstellen in seinen Produktionsabhängigkeiten beseitigt.

Vollständige Versionshinweise: https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.10`,
    pl_PL: `Zaktualizowano Ride The Lightning do 0.15.10.

Wydanie poświęcone higienie bezpieczeństwa. Żądania logowania są sprawdzane bardziej rygorystycznie — najbardziej dotyczy to konfiguracji z uwierzytelnianiem dwuskładnikowym — a dane uwierzytelniające nie trafiają już do logów węzłów ani nie są zwracane przez API konfiguracji. Ustawienia uwierzytelniania są teraz ustalone po stronie serwera, więc nie można ich zmienić przez API ustawień, a pobieranie kopii zapasowych kanałów ogranicza się do katalogu kopii wybranego węzła. Węzeł z wieloma kanałami nie wysyła już jednocześnie jednego zapytania o alias na kanał, a wyścig, który mógł wysłać żądanie z danymi uwierzytelniającymi niewłaściwego węzła, został naprawiony. Upstream usunął też wszystkie znane podatności w zależnościach produkcyjnych.

Pełne informacje o wydaniu: https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.10`,
    fr_FR: `Ride The Lightning a été mis à jour vers 0.15.10.

Une version consacrée à l'hygiène de sécurité. Les demandes de connexion sont validées plus strictement — les configurations à deux facteurs sont les plus concernées — et les identifiants ne sont plus écrits dans les journaux des nœuds ni renvoyés par l'API de configuration. Les paramètres d'authentification sont désormais fixés côté serveur et ne peuvent donc plus être modifiés via l'API de paramètres, et les téléchargements de sauvegardes de canaux sont limités au répertoire de sauvegarde du nœud sélectionné. Un nœud comportant de nombreux canaux ne lance plus une recherche d'alias par canal en même temps, et une situation de compétition pouvant envoyer une requête avec les identifiants du mauvais nœud a été corrigée. En amont, toutes les vulnérabilités connues des dépendances de production ont également été éliminées.

Notes de version complètes : https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.10`,
  },
  migrations: {},
})
