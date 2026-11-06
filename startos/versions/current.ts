import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.17:0',
  releaseNotes: {
    en_US: `Updated Ride The Lightning to 0.15.17. Requires StartOS 0.4.1 or later.

- Fixes login when opening RTL at the site root and clears session cookies correctly on logout.
- Accepts two-factor authentication codes when the server clock is slightly off.
- Allows labelling any LND on-chain transaction and keeps routing CSV columns consistent across exports.

[Full release notes](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.17)`,
    es_ES: `Ride The Lightning actualizado a 0.15.17. Requiere StartOS 0.4.1 o posterior.

- Corrige el inicio de sesión al abrir RTL en la raíz del sitio y elimina correctamente las cookies de sesión al cerrar sesión.
- Acepta códigos de autenticación de dos factores cuando el reloj del servidor está ligeramente desajustado.
- Permite etiquetar cualquier transacción en cadena de LND y mantiene las columnas CSV de enrutamiento uniformes entre exportaciones.

[Notas de la versión completas](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.17)`,
    de_DE: `Ride The Lightning wurde auf 0.15.17 aktualisiert. Erfordert StartOS 0.4.1 oder neuer.

- Behebt die Anmeldung beim Öffnen von RTL im Stammverzeichnis der Website und löscht Sitzungscookies beim Abmelden korrekt.
- Akzeptiert Zwei-Faktor-Authentifizierungscodes bei leicht abweichender Serveruhr.
- Ermöglicht das Beschriften jeder LND-On-Chain-Transaktion und hält die Spalten von Routing-CSV-Exporten einheitlich.

[Vollständige Versionshinweise](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.17)`,
    pl_PL: `Zaktualizowano Ride The Lightning do wersji 0.15.17. Wymaga StartOS 0.4.1 lub nowszego.

- Naprawiono logowanie po otwarciu RTL pod głównym adresem witryny oraz poprawiono usuwanie ciasteczek sesji przy wylogowaniu.
- Akceptuje kody uwierzytelniania dwuskładnikowego przy niewielkim odchyleniu zegara serwera.
- Umożliwia oznaczanie dowolnej transakcji on-chain LND i zachowuje spójne kolumny w eksportach CSV routingu.

[Pełne informacje o wydaniu](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.17)`,
    fr_FR: `Ride The Lightning a été mis à jour vers la version 0.15.17. Nécessite StartOS 0.4.1 ou ultérieur.

- Corrige la connexion lors de l'ouverture de RTL à la racine du site et supprime correctement les cookies de session à la déconnexion.
- Accepte les codes d'authentification à deux facteurs lorsque l'horloge du serveur est légèrement décalée.
- Permet d'étiqueter toute transaction LND sur la chaîne et conserve des colonnes cohérentes entre les exports CSV de routage.

[Notes de version complètes](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.17)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
