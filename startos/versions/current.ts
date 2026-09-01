import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.11:1',
  releaseNotes: {
    en_US: `Adds Eclair to the nodes **Set Nodes** can manage, alongside LND and Core Lightning. Run Eclair's **Set API Password** action before selecting it.`,
    es_ES: `Añade Eclair a los nodos que **Set Nodes** puede gestionar, junto a LND y Core Lightning. Ejecute la acción **Establecer la contraseña de la API** de Eclair antes de seleccionarlo.`,
    de_DE: `Fügt Eclair zu den Knoten hinzu, die **Set Nodes** verwalten kann, neben LND und Core Lightning. Führen Sie zuvor die Aktion **API-Passwort festlegen** von Eclair aus.`,
    pl_PL: `Dodaje Eclair do węzłów, którymi może zarządzać **Set Nodes**, obok LND i Core Lightning. Przed wyborem uruchom akcję **Ustaw hasło API** w Eclair.`,
    fr_FR: `Ajoute Eclair aux nœuds que **Set Nodes** peut gérer, aux côtés de LND et Core Lightning. Exécutez au préalable l'action **Définir le mot de passe de l'API** d'Eclair.`,
  },
  migrations: {},
})
