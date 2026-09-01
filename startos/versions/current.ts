import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.11:1',
  releaseNotes: {
    en_US: `Adds Eclair to the nodes **Set Nodes** can manage, alongside LND and Core Lightning.`,
    es_ES: `Añade Eclair a los nodos que **Set Nodes** puede gestionar, junto a LND y Core Lightning.`,
    de_DE: `Fügt Eclair zu den Knoten hinzu, die **Set Nodes** verwalten kann, neben LND und Core Lightning.`,
    pl_PL: `Dodaje Eclair do węzłów, którymi może zarządzać **Set Nodes**, obok LND i Core Lightning.`,
    fr_FR: `Ajoute Eclair aux nœuds que **Set Nodes** peut gérer, aux côtés de LND et Core Lightning.`,
  },
  migrations: {},
})
