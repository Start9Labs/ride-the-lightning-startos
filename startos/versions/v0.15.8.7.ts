import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { rtlConfig } from '../fileModels/RTL-Config.json'
import { clnMountpoint, lndMountpoint } from '../utils'

export const v_0_15_8_7 = VersionInfo.of({
  version: '0.15.8:7',
  releaseNotes: {
    en_US: `**Bumps**

- start-sdk → 1.5.3

**Fixes**

- Fixed a startup crash-loop when the default node didn't match a configured node (notably single Core Lightning setups).
- Stopped re-prompting to create a password when changing nodes if one was already set.`,
    es_ES: `**Actualizaciones**

- start-sdk → 1.5.3

**Correcciones**

- Se corrigió un bucle de fallos al iniciar cuando el nodo predeterminado no coincidía con ningún nodo configurado (especialmente configuraciones con un solo Core Lightning).
- Se dejó de solicitar de nuevo la creación de una contraseña al cambiar los nodos si ya había una configurada.`,
    de_DE: `**Aktualisierungen**

- start-sdk → 1.5.3

**Korrekturen**

- Start-Absturzschleife behoben, wenn der Standard-Node zu keinem konfigurierten Node passte (insbesondere Setups mit nur Core Lightning).
- Keine erneute Aufforderung zur Passworterstellung mehr beim Ändern von Nodes, wenn bereits eines gesetzt ist.`,
    pl_PL: `**Aktualizacje**

- start-sdk → 1.5.3

**Poprawki**

- Naprawiono pętlę awarii przy starcie, gdy domyślny węzeł nie pasował do skonfigurowanego węzła (zwłaszcza konfiguracje z jednym Core Lightning).
- Zaprzestano ponownego proszenia o utworzenie hasła przy zmianie węzłów, jeśli zostało już ustawione.`,
    fr_FR: `**Mises à jour**

- start-sdk → 1.5.3

**Corrections**

- Correction d'une boucle de plantage au démarrage lorsque le nœud par défaut ne correspondait à aucun nœud configuré (notamment les configurations avec un seul Core Lightning).
- L'invite de création de mot de passe ne réapparaît plus lors du changement de nœuds si un mot de passe est déjà défini.`,
  },
  migrations: {
    up: async ({ effects }) => {
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
            n.settings.lnServerUrl = 'https://c-lightning.startos:3010'
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
