import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'
import { rtlConfig } from '../fileModels/RTL-Config.json'
import { lndMountpoint } from '../utils'

export const current = VersionInfo.of({
  version: '0.15.17:1',
  releaseNotes: {
    en_US: `RTL now reads only the credential it needs from LND, Core Lightning or Eclair, and can no longer read that node's seed or other files. Requires LND 0.21.6-beta:3, Core Lightning 26.6.10:3 or Eclair 0.14.6:2 or later.`,
    es_ES: `RTL ahora lee solo la credencial que necesita de LND, Core Lightning o Eclair, y ya no puede leer la semilla ni otros archivos de ese nodo. Requiere LND 0.21.6-beta:3, Core Lightning 26.6.10:3 o Eclair 0.14.6:2 o posterior.`,
    de_DE: `RTL liest von LND, Core Lightning oder Eclair jetzt nur noch die benötigte Zugangsberechtigung und kann den Seed und andere Dateien dieses Knotens nicht mehr lesen. Erfordert LND 0.21.6-beta:3, Core Lightning 26.6.10:3 oder Eclair 0.14.6:2 oder neuer.`,
    pl_PL: `RTL odczytuje teraz z LND, Core Lightning lub Eclair tylko potrzebne mu poświadczenie i nie może już odczytać seeda ani innych plików tego węzła. Wymaga LND 0.21.6-beta:3, Core Lightning 26.6.10:3 lub Eclair 0.14.6:2 albo nowszych.`,
    fr_FR: `RTL ne lit désormais que l'identifiant dont il a besoin auprès de LND, Core Lightning ou Eclair, et ne peut plus lire la seed ni les autres fichiers de ce nœud. Nécessite LND 0.21.6-beta:3, Core Lightning 26.6.10:3 ou Eclair 0.14.6:2 ou ultérieur.`,
  },
  migrations: {
    up: async ({ effects }) => {
      const nodes = await rtlConfig.read((c) => c.nodes).once()
      if (!nodes) return
      for (const n of nodes)
        if (n.authentication.macaroonPath?.startsWith(lndMountpoint))
          n.authentication.macaroonPath = lndMountpoint
      await rtlConfig.merge(effects, { nodes })
    },
    down: IMPOSSIBLE,
  },
})
