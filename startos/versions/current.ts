import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { rtlConfig } from '../fileModels/RTL-Config.json'
import { clnMountpoint, lndMountpoint } from '../utils'

export const current = VersionInfo.of({
  version: '0.15.8:8',
  releaseNotes: {
    en_US: `**Fixes**

- Fixed connecting to an internal Core Lightning (CLN) node. RTL now reaches CLN's REST API over HTTP (clnrest serves plaintext), resolving the "packet length too long" SSL error on startup. Existing CLN nodes are corrected automatically on upgrade.`,
    es_ES: `**Correcciones**

- Se corrigió la conexión a un nodo interno de Core Lightning (CLN). RTL ahora accede a la API REST de CLN por HTTP (clnrest sirve texto plano), resolviendo el error SSL "packet length too long" al iniciar. Los nodos CLN existentes se corrigen automáticamente al actualizar.`,
    de_DE: `**Korrekturen**

- Verbindung zu einem internen Core-Lightning-(CLN-)Node behoben. RTL erreicht die REST-API von CLN jetzt über HTTP (clnrest liefert Klartext) und behebt so den SSL-Fehler "packet length too long" beim Start. Bestehende CLN-Nodes werden beim Upgrade automatisch korrigiert.`,
    pl_PL: `**Poprawki**

- Naprawiono łączenie z wewnętrznym węzłem Core Lightning (CLN). RTL łączy się teraz z API REST węzła CLN przez HTTP (clnrest udostępnia zwykły tekst), co rozwiązuje błąd SSL "packet length too long" przy starcie. Istniejące węzły CLN są poprawiane automatycznie podczas aktualizacji.`,
    fr_FR: `**Corrections**

- Correction de la connexion à un nœud Core Lightning (CLN) interne. RTL accède désormais à l'API REST de CLN en HTTP (clnrest fournit du texte en clair), ce qui résout l'erreur SSL « packet length too long » au démarrage. Les nœuds CLN existants sont corrigés automatiquement lors de la mise à jour.`,
  },
  migrations: {
    up: async ({ effects }) => {
      // Heal internal CLN nodes still pointed at https. clnrest serves plaintext
      // HTTP, so an https URL fails the TLS handshake with OpenSSL's "packet
      // length too long" (EPROTO) on every request. Flip the saved URL to http.
      const clnCfg = await rtlConfig.read().once()
      if (clnCfg) {
        await rtlConfig.merge(effects, {
          nodes: clnCfg.nodes.map((n) =>
            n.settings.lnServerUrl === 'https://c-lightning.startos:3010'
              ? {
                  ...n,
                  settings: {
                    ...n.settings,
                    lnServerUrl: 'http://c-lightning.startos:3010',
                  },
                }
              : n,
          ),
        })
      }

      // 0.3.5.1 migration: migrate .embassy URLs to .startos
      const configYaml = await readFile(
        '/media/startos/volumes/main/start9/config.yaml',
        'utf-8',
      ).then(YAML.parse, () => undefined)

      if (configYaml) {
        const config = await rtlConfig.read().once()

        // Remember which node was the default before we renumber, so we can
        // keep the default pointed at the same node below.
        const previousDefaultName = config?.nodes.find(
          (n) => n.index === config.defaultNodeIndex,
        )?.lnNode

        const nodes = (config?.nodes ?? []).map((n) => {
          if (n.settings.lnServerUrl.includes('lnd.embassy')) {
            n.settings.lnServerUrl = 'https://lnd.startos:8080'
            n.settings.channelBackupPath = '/root/backup/Internal-LND'
            n.lnNode = 'Internal LND'
            n.authentication.macaroonPath = `${lndMountpoint}/data/chain/bitcoin/mainnet`
          } else if (n.settings.lnServerUrl.includes('c-lightning.embassy')) {
            n.settings.lnServerUrl = 'http://c-lightning.startos:3010'
            n.settings.channelBackupPath = '/root/backup/Internal-CLN'
            n.lnNode = 'Internal CLN'
            n.authentication.runePath = `${clnMountpoint}/.commando-env`
            n.lnImplementation = 'CLN'
          }
          return n
        })

        // Renumber positionally (the index values are just identifiers) and keep
        // defaultNodeIndex on the same node, else the first. A previously-orphaned
        // default — e.g. a lone CLN node that the old config had at index 1 with
        // defaultNodeIndex still 1 — is what crashes RTL in its logger constructor.
        nodes.forEach((n, i) => (n.index = i + 1))
        const defaultNodeIndex =
          nodes.find((n) => n.lnNode === previousDefaultName)?.index ?? 1

        await rtlConfig.merge(effects, {
          nodes,
          defaultNodeIndex,
        })

        await rm('/media/startos/volumes/main/lnd-external', {
          recursive: true,
          force: true,
        }).catch(console.log)

        await rm('/media/startos/volumes/main/start9', {
          recursive: true,
          force: true,
        }).catch(console.log)
      }
    },
    down: IMPOSSIBLE,
  },
})
