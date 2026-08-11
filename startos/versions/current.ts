import { VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.15.10:1',
  releaseNotes: {
    en_US: `Credentials for remote nodes are now stored with restrictive permissions.

When you add a remote node, the macaroon or rune you paste in — which grants full control of that node — was written with the filesystem's ordinary default permissions rather than being restricted to the service, as were the directory holding it and the channel-backup directory beside it. All three are now locked down. Saving a node again applies this to credentials that were stored previously, not only to new ones.

The node name is also checked more strictly. It was validated against any part of the name rather than the whole of it, so a name only partly made of letters and numbers could slip through; that name becomes a directory holding the credential, so it is now required to match in full.`,
    es_ES: `Las credenciales de los nodos remotos ahora se guardan con permisos restrictivos.

Al añadir un nodo remoto, el macaroon o rune que pega —que otorga control total de ese nodo— se escribía con los permisos predeterminados del sistema de archivos en lugar de quedar restringido al servicio, al igual que el directorio que lo contiene y el directorio de copias de seguridad de canales contiguo. Los tres quedan ahora protegidos. Volver a guardar un nodo aplica esto también a las credenciales guardadas anteriormente, no solo a las nuevas.

El nombre del nodo también se comprueba de forma más estricta. Se validaba contra cualquier parte del nombre en lugar de contra el nombre completo, de modo que podía colarse un nombre formado solo en parte por letras y números; ese nombre se convierte en el directorio que guarda la credencial, así que ahora debe coincidir por completo.`,
    de_DE: `Zugangsdaten für entfernte Knoten werden jetzt mit restriktiven Berechtigungen gespeichert.

Beim Hinzufügen eines entfernten Knotens wurde das eingefügte Macaroon bzw. die Rune — die volle Kontrolle über diesen Knoten gewährt — mit den üblichen Standardberechtigungen des Dateisystems geschrieben, statt auf den Dienst beschränkt zu sein; ebenso das zugehörige Verzeichnis und das daneben liegende Verzeichnis der Kanal-Backups. Alle drei sind nun abgesichert. Wird ein Knoten erneut gespeichert, gilt das auch für zuvor abgelegte Zugangsdaten, nicht nur für neue.

Auch der Knotenname wird strenger geprüft. Bisher wurde gegen einen beliebigen Teil des Namens geprüft statt gegen den ganzen, sodass ein nur teilweise aus Buchstaben und Ziffern bestehender Name durchrutschen konnte; aus diesem Namen wird das Verzeichnis der Zugangsdaten, daher muss er nun vollständig übereinstimmen.`,
    pl_PL: `Poświadczenia zdalnych węzłów są teraz zapisywane z restrykcyjnymi uprawnieniami.

Przy dodawaniu zdalnego węzła wklejany macaroon lub rune — dający pełną kontrolę nad tym węzłem — był zapisywany ze zwykłymi domyślnymi uprawnieniami systemu plików, zamiast być ograniczonym do samej usługi; tak samo katalog, który go przechowuje, i sąsiadujący katalog kopii zapasowych kanałów. Wszystkie trzy są teraz zabezpieczone. Ponowne zapisanie węzła stosuje to również do poświadczeń zapisanych wcześniej, nie tylko do nowych.

Nazwa węzła jest też sprawdzana ściślej. Była weryfikowana względem dowolnej części nazwy, a nie całości, więc nazwa złożona tylko częściowo z liter i cyfr mogła się prześlizgnąć; z tej nazwy powstaje katalog przechowujący poświadczenie, dlatego teraz musi pasować w całości.`,
    fr_FR: `Les identifiants des nœuds distants sont désormais enregistrés avec des permissions restrictives.

Lorsque vous ajoutez un nœud distant, le macaroon ou la rune que vous collez — qui donne le contrôle total de ce nœud — était écrit avec les permissions par défaut du système de fichiers au lieu d'être réservé au service, tout comme le répertoire qui le contient et le répertoire de sauvegardes de canaux voisin. Les trois sont maintenant verrouillés. Réenregistrer un nœud applique cela aux identifiants déjà stockés, et pas seulement aux nouveaux.

Le nom du nœud est également vérifié plus strictement. Il était validé sur une partie quelconque du nom plutôt que sur son ensemble, si bien qu'un nom composé seulement en partie de lettres et de chiffres pouvait passer ; ce nom devient le répertoire qui contient l'identifiant, il doit donc désormais correspondre entièrement.`,
  },
  migrations: {},
})
