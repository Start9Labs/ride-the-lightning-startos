import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.16:0',
  releaseNotes: {
    en_US: `Updated Ride The Lightning to 0.15.16.

- Restricts session and CSRF cookies to RTL's base path.
- Refreshes the container's CA certificates to reject compromised eMudhra certificates.
- Updates dependencies to fix security vulnerabilities, including body-parser.
- Updates start-sdk to 3.1.1.

[Full release notes](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.16)`,
    es_ES: `Ride The Lightning actualizado a 0.15.16.

- Restringe las cookies de sesión y CSRF a la ruta base de RTL.
- Renueva los certificados de CA del contenedor para rechazar los certificados comprometidos de eMudhra.
- Actualiza las dependencias para corregir vulnerabilidades de seguridad, incluida body-parser.
- Actualiza start-sdk a 3.1.1.

[Notas de la versión completas](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.16)`,
    de_DE: `Ride The Lightning wurde auf 0.15.16 aktualisiert.

- Beschränkt Sitzungs- und CSRF-Cookies auf den Basispfad von RTL.
- Aktualisiert die CA-Zertifikate des Containers, um kompromittierte eMudhra-Zertifikate abzulehnen.
- Aktualisiert Abhängigkeiten zur Behebung von Sicherheitslücken, darunter body-parser.
- Aktualisiert start-sdk auf 3.1.1.

[Vollständige Versionshinweise](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.16)`,
    pl_PL: `Zaktualizowano Ride The Lightning do wersji 0.15.16.

- Ograniczono ciasteczka sesji i CSRF do ścieżki bazowej RTL.
- Odświeżono certyfikaty CA kontenera, aby odrzucać przejęte certyfikaty eMudhra.
- Zaktualizowano zależności w celu usunięcia luk bezpieczeństwa, w tym w body-parser.
- Zaktualizowano start-sdk do wersji 3.1.1.

[Pełne informacje o wydaniu](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.16)`,
    fr_FR: `Ride The Lightning a été mis à jour vers la version 0.15.16.

- Limite les cookies de session et CSRF au chemin de base de RTL.
- Actualise les certificats CA du conteneur pour rejeter les certificats eMudhra compromis.
- Met à jour les dépendances pour corriger des failles de sécurité, notamment dans body-parser.
- Met à jour start-sdk vers la version 3.1.1.

[Notes de version complètes](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.16)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
