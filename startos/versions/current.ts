import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.9:0',
  releaseNotes: {
    en_US:
      'Updated Ride The Lightning to 0.15.9: security and dependency hardening (zero production vulnerabilities), multi-node authentication fixes, and Core Lightning channel-status corrections.',
    es_ES:
      'Ride The Lightning actualizado a 0.15.9: refuerzo de seguridad y dependencias (cero vulnerabilidades en producción), correcciones de autenticación multinodo y correcciones del estado de los canales de Core Lightning.',
    de_DE:
      'Ride The Lightning auf 0.15.9 aktualisiert: Härtung von Sicherheit und Abhängigkeiten (null Produktions-Schwachstellen), Korrekturen der Multi-Node-Authentifizierung und Korrekturen des Core-Lightning-Kanalstatus.',
    pl_PL:
      'Zaktualizowano Ride The Lightning do 0.15.9: wzmocnienie bezpieczeństwa i zależności (zero luk w środowisku produkcyjnym), poprawki uwierzytelniania wielowęzłowego oraz poprawki stanu kanałów Core Lightning.',
    fr_FR:
      'Ride The Lightning mis à jour vers 0.15.9 : renforcement de la sécurité et des dépendances (zéro vulnérabilité en production), corrections de l’authentification multi-nœuds et corrections de l’état des canaux Core Lightning.',
  },
  migrations: {},
})
