import { IMPOSSIBLE, VersionInfo, YAML } from '@start9labs/start-sdk'
import { readFile, rm } from 'fs/promises'
import { rtlConfig } from '../fileModels/RTL-Config.json'
import { clnMountpoint, lndMountpoint } from '../utils'

export const current = VersionInfo.of({
  version: '0.15.8:9',
  releaseNotes: {
    en_US: 'Internal updates (start-sdk 2.0.x)',
    es_ES: 'Actualizaciones internas (start-sdk 2.0.x)',
    de_DE: 'Interne Aktualisierungen (start-sdk 2.0.x)',
    pl_PL: 'Aktualizacje wewnętrzne (start-sdk 2.0.x)',
    fr_FR: 'Mises à jour internes (start-sdk 2.0.x)',
  },
  migrations: {
    up: async ({ effects }) => {
      // 0.3.5.1 migration: drop legacy .embassy URLs on internal nodes; main
      // resolves the dependency's live LXC-bridge address and writes it (or
      // throws) on every start (`.startos` DNS is retired in StartOS 0.4.x), so
      // the address is left absent here rather than fabricated.
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
          if (n.settings.lnServerUrl?.includes('lnd.embassy')) {
            n.settings.lnServerUrl = undefined
            n.settings.channelBackupPath = '/root/backup/Internal-LND'
            n.lnNode = 'Internal LND'
            n.authentication.macaroonPath = `${lndMountpoint}/data/chain/bitcoin/mainnet`
          } else if (n.settings.lnServerUrl?.includes('c-lightning.embassy')) {
            n.settings.lnServerUrl = undefined
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
