import { VersionInfo } from '@start9labs/start-sdk'
import { readFile, rm, writeFile } from 'fs/promises'
import { rtlConfig } from '../fileModels/RTL-Config.json'
import { clnMountpoint, runeFileContents, toDisk } from '../utils'

export const current = VersionInfo.of({
  version: '0.15.13:1',
  releaseNotes: {
    en_US: `- Reset Password asks for confirmation before replacing an existing password, and is named Reset Password as soon as a password has been created.
- The descriptions of Set Nodes' remote node list, implementation and node name explain each choice.
- Set Nodes takes a rune for a remote Core Lightning node, and remote Core Lightning nodes added earlier now connect.
- Set Nodes keeps each node's RTL settings, such as theme and currency.
- With an internal Core Lightning node, RTL raises a task to turn on CLNrest in Core Lightning whenever it is off.`,
    es_ES: `- Reset Password pide confirmación antes de reemplazar una contraseña existente, y se llama Reset Password en cuanto se ha creado una contraseña.
- Las descripciones de la lista de nodos remotos, la implementación y el nombre del nodo en Set Nodes explican cada opción.
- Set Nodes acepta una runa para un nodo remoto de Core Lightning, y los nodos remotos de Core Lightning añadidos antes ahora se conectan.
- Set Nodes conserva los ajustes de RTL de cada nodo, como el tema y la moneda.
- Con un nodo interno de Core Lightning, RTL crea una tarea para activar CLNrest en Core Lightning siempre que esté desactivado.`,
    de_DE: `- Reset Password fragt vor dem Ersetzen eines bestehenden Passworts nach einer Bestätigung und heißt Reset Password, sobald ein Passwort erstellt wurde.
- Die Beschreibungen der Liste entfernter Knoten, der Implementierung und des Knotennamens in Set Nodes erklären jede Auswahl.
- Set Nodes nimmt für einen entfernten Core-Lightning-Knoten eine Rune entgegen, und zuvor hinzugefügte entfernte Core-Lightning-Knoten verbinden sich jetzt.
- Set Nodes behält die RTL-Einstellungen jedes Knotens bei, etwa Design und Währung.
- Mit einem internen Core-Lightning-Knoten erstellt RTL eine Aufgabe, CLNrest in Core Lightning einzuschalten, sobald es ausgeschaltet ist.`,
    pl_PL: `- Reset Password prosi o potwierdzenie przed zastąpieniem istniejącego hasła i nazywa się Reset Password, gdy tylko hasło zostanie utworzone.
- Opisy listy zdalnych węzłów, implementacji i nazwy węzła w akcji Set Nodes wyjaśniają każdy wybór.
- Set Nodes przyjmuje runę dla zdalnego węzła Core Lightning, a dodane wcześniej zdalne węzły Core Lightning teraz się łączą.
- Set Nodes zachowuje ustawienia RTL każdego węzła, takie jak motyw i waluta.
- Przy wewnętrznym węźle Core Lightning RTL tworzy zadanie włączenia CLNrest w Core Lightning, gdy jest ono wyłączone.`,
    fr_FR: `- Reset Password demande une confirmation avant de remplacer un mot de passe existant, et s'appelle Reset Password dès qu'un mot de passe a été créé.
- Les descriptions de la liste des nœuds distants, de l'implémentation et du nom du nœud dans Set Nodes expliquent chaque choix.
- Set Nodes accepte une rune pour un nœud Core Lightning distant, et les nœuds Core Lightning distants ajoutés auparavant se connectent désormais.
- Set Nodes conserve les réglages RTL de chaque nœud, comme le thème et la devise.
- Avec un nœud Core Lightning interne, RTL crée une tâche pour activer CLNrest dans Core Lightning dès qu'il est désactivé.`,
  },
  migrations: {
    up: async ({ effects }) => {
      const nodes = await rtlConfig.read((c) => c.nodes).once()
      if (!nodes) return
      const remoteCln = nodes.filter(
        (n) =>
          n.lnImplementation === 'CLN' &&
          n.authentication.runePath &&
          !n.authentication.runePath.startsWith(clnMountpoint),
      )
      if (!remoteCln.length) return
      for (const n of remoteCln) {
        const dir = toDisk(n.authentication.runePath!)
        const rune = await readFile(`${dir}/access.macaroon`)
          .then((b) => b.toString('base64url'))
          .catch(() => null)
        if (!rune) continue
        await writeFile(`${dir}/rune`, runeFileContents(rune), { mode: 0o600 })
        await rm(`${dir}/access.macaroon`)
        n.authentication.runePath += '/rune'
      }
      await rtlConfig.merge(effects, { nodes })
    },
  },
})
