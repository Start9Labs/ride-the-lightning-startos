import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.14:0',
  releaseNotes: {
    en_US: `Updated Ride The Lightning to 0.15.14.

- Fixes cross-node session interference and protects LND channel backups when another node fails.
- Supports Eclair 0.14 payment history and reports; shows fee limits before payments and rebalances.
- Hardens logout, CSV exports and external links. Block explorer URLs are now configured in RTL-Config.json, not the settings UI; existing URLs are preserved.
- Updates start-sdk to 3.1.0.

[Full release notes](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.14)`,
    es_ES: `Ride The Lightning actualizado a 0.15.14.

- Corrige interferencias entre sesiones de distintos nodos y protege las copias de seguridad de canales LND cuando falla otro nodo.
- Admite el historial de pagos y los informes de Eclair 0.14; muestra los límites de comisiones antes de pagos y reequilibrios.
- Refuerza el cierre de sesión, las exportaciones CSV y los enlaces externos. Las URL de exploradores de bloques se configuran ahora en RTL-Config.json, no en la interfaz de ajustes; se conservan las URL existentes.
- Actualiza start-sdk a 3.1.0.

[Notas de la versión completas](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.14)`,
    de_DE: `Ride The Lightning wurde auf 0.15.14 aktualisiert.

- Behebt gegenseitige Störungen von Sitzungen verschiedener Knoten und schützt LND-Kanalsicherungen beim Ausfall eines anderen Knotens.
- Unterstützt den Zahlungsverlauf und Berichte von Eclair 0.14; zeigt Gebührenlimits vor Zahlungen und Rebalancing an.
- Sichert Abmeldung, CSV-Exporte und externe Links ab. Blockexplorer-URLs werden jetzt in RTL-Config.json statt in der Einstellungsoberfläche konfiguriert; vorhandene URLs bleiben erhalten.
- Aktualisiert start-sdk auf 3.1.0.

[Vollständige Versionshinweise](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.14)`,
    pl_PL: `Zaktualizowano Ride The Lightning do wersji 0.15.14.

- Naprawiono wzajemne zakłócanie sesji różnych węzłów i zabezpieczono kopie kanałów LND na wypadek awarii innego węzła.
- Dodano obsługę historii płatności i raportów Eclair 0.14; limity opłat są pokazywane przed płatnościami i równoważeniem kanałów.
- Wzmocniono wylogowywanie, eksport CSV i odnośniki zewnętrzne. Adresy eksploratorów bloków konfiguruje się teraz w RTL-Config.json, a nie w interfejsie ustawień; istniejące adresy są zachowywane.
- Zaktualizowano start-sdk do wersji 3.1.0.

[Pełne informacje o wydaniu](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.14)`,
    fr_FR: `Ride The Lightning a été mis à jour vers la version 0.15.14.

- Corrige les interférences entre sessions de nœuds différents et protège les sauvegardes de canaux LND lorsqu'un autre nœud tombe en panne.
- Prend en charge l'historique des paiements et les rapports d'Eclair 0.14 ; affiche les limites de frais avant les paiements et les rééquilibrages.
- Renforce la déconnexion, les exports CSV et les liens externes. Les URL d'explorateurs de blocs se configurent désormais dans RTL-Config.json, et non dans l'interface des paramètres ; les URL existantes sont conservées.
- Met à jour start-sdk vers la version 3.1.0.

[Notes de version complètes](https://github.com/Ride-The-Lightning/RTL/releases/tag/v0.15.14)`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
