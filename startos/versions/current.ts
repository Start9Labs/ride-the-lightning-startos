import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.11:0',
  releaseNotes: {
    en_US: `Updated Ride The Lightning to 0.15.11.

- Fixes a bug where, with more than one LND node attached, peer alias lookups and connect requests could be sent to the wrong node — showing truncated aliases or failing to connect.
- The two-factor code field is now recognised by browsers and password managers, so the code can be filled in for you.
- Ride The Lightning now publishes a security policy with a private channel for reporting vulnerabilities.

Full upstream release notes: https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.11`,
    es_ES: `Ride The Lightning actualizado a 0.15.11.

- Corrige un fallo por el que, con más de un nodo LND conectado, las consultas de alias de pares y las solicitudes de conexión podían enviarse al nodo equivocado, mostrando alias truncados o fallando al conectar.
- El campo del código de dos factores ahora lo reconocen los navegadores y gestores de contraseñas, de modo que pueden rellenarlo por usted.
- Ride The Lightning publica ahora una política de seguridad con un canal privado para informar de vulnerabilidades.

Notas de la versión completas: https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.11`,
    de_DE: `Ride The Lightning auf 0.15.11 aktualisiert.

- Behebt einen Fehler, durch den bei mehreren angebundenen LND-Knoten Alias-Abfragen und Verbindungsanfragen an den falschen Knoten gehen konnten — mit abgeschnittenen Aliassen oder fehlgeschlagenen Verbindungen.
- Das Feld für den Zwei-Faktor-Code wird jetzt von Browsern und Passwortmanagern erkannt, sodass der Code für Sie ausgefüllt werden kann.
- Ride The Lightning veröffentlicht nun eine Sicherheitsrichtlinie mit einem privaten Kanal zum Melden von Schwachstellen.

Vollständige Versionshinweise: https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.11`,
    pl_PL: `Zaktualizowano Ride The Lightning do 0.15.11.

- Naprawiono błąd, przez który przy podłączeniu więcej niż jednego węzła LND zapytania o aliasy peerów i żądania połączenia mogły trafiać do niewłaściwego węzła — pokazując skrócone aliasy lub kończąc się niepowodzeniem.
- Pole kodu dwuskładnikowego jest teraz rozpoznawane przez przeglądarki i menedżery haseł, więc kod może zostać wypełniony za Ciebie.
- Ride The Lightning publikuje teraz politykę bezpieczeństwa z prywatnym kanałem zgłaszania podatności.

Pełne informacje o wydaniu: https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.11`,
    fr_FR: `Ride The Lightning mis à jour vers 0.15.11.

- Corrige un défaut qui, avec plusieurs nœuds LND rattachés, pouvait envoyer les recherches d'alias de pairs et les demandes de connexion au mauvais nœud — alias tronqués ou connexion échouée.
- Le champ du code à deux facteurs est désormais reconnu par les navigateurs et gestionnaires de mots de passe, qui peuvent donc le remplir pour vous.
- Ride The Lightning publie maintenant une politique de sécurité avec un canal privé pour signaler les vulnérabilités.

Notes de version complètes : https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.11`,
  },
  migrations: {},
})
