import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.12:0',
  releaseNotes: {
    en_US: `Updated Ride The Lightning to 0.15.12.

- Security: hardens login lockouts and application settings, and protects every state-changing route
- LND: adds an option to open a channel with the entire wallet balance
- Eclair: pages large invoice histories and reports channel-open failures correctly
- StartOS: trusts the OS reverse proxy so login lockouts count each client separately

[Full release notes](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.12)`,
    es_ES: `Ride The Lightning actualizado a 0.15.12.

- Seguridad: refuerza los bloqueos de inicio de sesión y la configuración de la aplicación, y protege todas las rutas que cambian el estado
- LND: añade una opción para abrir un canal con todo el saldo de la cartera
- Eclair: pagina historiales de facturas grandes e informa correctamente de los fallos al abrir canales
- StartOS: confía en el proxy inverso del sistema operativo para que los bloqueos de inicio de sesión cuenten cada cliente por separado

[Notas de la versión completas](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.12)`,
    de_DE: `Ride The Lightning wurde auf 0.15.12 aktualisiert.

- Sicherheit: verbessert Anmeldesperren und Anwendungseinstellungen und schützt alle zustandsändernden Routen
- LND: fügt eine Option hinzu, einen Kanal mit dem gesamten Wallet-Guthaben zu öffnen
- Eclair: teilt große Rechnungsverläufe in Seiten auf und meldet Fehler beim Öffnen von Kanälen korrekt
- StartOS: vertraut dem Reverse-Proxy des Betriebssystems, damit Anmeldesperren jeden Client getrennt zählen

[Vollständige Versionshinweise](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.12)`,
    pl_PL: `Zaktualizowano Ride The Lightning do wersji 0.15.12.

- Bezpieczeństwo: wzmacnia blokady logowania i ustawienia aplikacji oraz chroni wszystkie trasy zmieniające stan
- LND: dodaje opcję otwarcia kanału z wykorzystaniem całego salda portfela
- Eclair: dzieli duże historie faktur na strony i prawidłowo zgłasza błędy otwierania kanałów
- StartOS: ufa odwrotnemu serwerowi proxy systemu operacyjnego, dzięki czemu blokady logowania liczą każdego klienta osobno

[Pełne informacje o wydaniu](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.12)`,
    fr_FR: `Ride The Lightning a été mis à jour vers la version 0.15.12.

- Sécurité : renforce le verrouillage des connexions et les paramètres de l'application, et protège toutes les routes qui modifient l'état
- LND : ajoute une option permettant d'ouvrir un canal avec la totalité du solde du portefeuille
- Eclair : pagine les historiques de factures volumineux et signale correctement les échecs d'ouverture de canal
- StartOS : approuve le proxy inverse du système d'exploitation afin que le verrouillage des connexions comptabilise chaque client séparément

[Notes de version complètes](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.12)`,
  },
  migrations: {},
})
