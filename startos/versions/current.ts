import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.15:0',
  releaseNotes: {
    en_US: `Updated Ride The Lightning to 0.15.15.

- Stops trusting certificates from a compromised certificate authority (eMudhra).
- Runs on Node.js 22.23.4, which fixes a high-severity flaw in its Brotli decoder.

[Full release notes](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.15)`,
    es_ES: `Ride The Lightning actualizado a 0.15.15.

- Deja de confiar en los certificados de una autoridad de certificación comprometida (eMudhra).
- Funciona con Node.js 22.23.4, que corrige una vulnerabilidad grave en su descompresor Brotli.

[Notas de la versión completas](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.15)`,
    de_DE: `Ride The Lightning wurde auf 0.15.15 aktualisiert.

- Vertraut Zertifikaten einer kompromittierten Zertifizierungsstelle (eMudhra) nicht mehr.
- Läuft auf Node.js 22.23.4, das eine schwerwiegende Lücke in dessen Brotli-Decoder behebt.

[Vollständige Versionshinweise](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.15)`,
    pl_PL: `Zaktualizowano Ride The Lightning do wersji 0.15.15.

- Przestaje ufać certyfikatom przejętego urzędu certyfikacji (eMudhra).
- Działa na Node.js 22.23.4, który usuwa poważną lukę w dekoderze Brotli.

[Pełne informacje o wydaniu](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.15)`,
    fr_FR: `Ride The Lightning a été mis à jour vers la version 0.15.15.

- Ne fait plus confiance aux certificats d'une autorité de certification compromise (eMudhra).
- Fonctionne sous Node.js 22.23.4, qui corrige une faille grave de son décodeur Brotli.

[Notes de version complètes](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.15)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
