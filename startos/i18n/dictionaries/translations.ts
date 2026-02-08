import { LangDict } from './default'

export default {
  es_ES: {
    // main.ts
    1: 'La interfaz web está lista',
    2: 'La interfaz web no está lista',
    3: 'Elige qué nodos gestionará RTL',
    4: 'nodos no encontrados en el archivo de configuración',
    5: 'Interfaz web',

    // interfaces.ts
    100: 'Interfaz web',
    101: 'La interfaz web de RTL',

    // actions/resetPassword.ts
    200: 'Restablecer contraseña',
    201: 'Crear contraseña',
    202: 'Restablecer tu contraseña de interfaz de usuario',
    203: 'Crear tu contraseña de interfaz de usuario',
    204: '¿Crear nueva contraseña?',
    205: 'Éxito',
    206: 'Tu nueva contraseña se muestra a continuación. Guárdala en un gestor de contraseñas.',

    // actions/setNodes.ts
    300: 'Nodos remotos',
    301: 'Lista de nodos Lightning a administrar',
    302: 'Implementación',
    303: 'La implementación del nodo Lightning subyacente: actualmente, LND o CLN',
    304: 'Nombre del nodo',
    305: 'Nombre de este nodo en la lista',
    306: 'El nombre solo puede contener A-Z, a-z y 0-9',
    307: 'URL del servidor REST',
    308: 'La URL completa del servidor REST de tu nodo, incluyendo protocolo y puerto.\nNOTA: RTL no admite una URL .onion aquí',
    309: 'Macaroon',
    310: 'Tu admin.macaroon (LND) o access.macaroon (CLN), codificado en Base64URL.',
    311: 'El macaroon debe estar codificado en formato Base64URL (solo se permiten A-Z, a-z, 0-9, _, - y =)',
    312: 'Nodos internos',
    313: '- LND: Lightning Network Daemon de Lightning Labs\n- CLN: Core Lightning de Blockstream\n',
    314: 'Establecer nodos',
    315: 'Elige qué nodos administrar desde RTL',

    // manifest/index.ts
    400: 'Conecta opcionalmente RTL a tu nodo CLN.',
    401: 'Conecta opcionalmente RTL a tu nodo LND.',
  },
  de_DE: {
    // main.ts
    1: 'Die Weboberfläche ist bereit',
    2: 'Die Weboberfläche ist nicht bereit',
    3: 'Wählen Sie, welche Knoten RTL verwalten soll',
    4: 'Knoten nicht in der Konfigurationsdatei gefunden',
    5: 'Weboberfläche',

    // interfaces.ts
    100: 'Weboberfläche',
    101: 'Die Weboberfläche von RTL',

    // actions/resetPassword.ts
    200: 'Passwort zurücksetzen',
    201: 'Passwort erstellen',
    202: 'Ihr Passwort für die Benutzeroberfläche zurücksetzen',
    203: 'Ihr Passwort für die Benutzeroberfläche erstellen',
    204: 'Neues Passwort erstellen?',
    205: 'Erfolg',
    206: 'Ihr neues Passwort wird unten angezeigt. Speichern Sie es in einem Passwort-Manager.',

    // actions/setNodes.ts
    300: 'Remote-Knoten',
    301: 'Liste der zu verwaltenden Lightning-Knoten',
    302: 'Implementierung',
    303: 'Die zugrunde liegende Lightning-Knoten-Implementierung: derzeit LND oder CLN',
    304: 'Knotenname',
    305: 'Name dieses Knotens in der Liste',
    306: 'Name darf nur A-Z, a-z und 0-9 enthalten',
    307: 'REST-Server-URL',
    308: 'Die vollqualifizierte URL des REST-Servers Ihres Knotens, einschließlich Protokoll und Port.\nHINWEIS: RTL unterstützt hier keine .onion-URL',
    309: 'Macaroon',
    310: 'Ihr admin.macaroon (LND) oder access.macaroon (CLN), Base64URL-codiert.',
    311: 'Macaroon muss im Base64URL-Format codiert sein (nur A-Z, a-z, 0-9, _, - und = erlaubt)',
    312: 'Interne Knoten',
    313: '- LND: Lightning Network Daemon von Lightning Labs\n- CLN: Core Lightning von Blockstream\n',
    314: 'Knoten festlegen',
    315: 'Wählen Sie, welche Knoten von RTL verwaltet werden sollen',

    // manifest/index.ts
    400: 'Verbinden Sie RTL optional mit Ihrem CLN-Knoten.',
    401: 'Verbinden Sie RTL optional mit Ihrem LND-Knoten.',
  },
  pl_PL: {
    // main.ts
    1: 'Interfejs webowy jest gotowy',
    2: 'Interfejs webowy nie jest gotowy',
    3: 'Wybierz, którymi węzłami będzie zarządzać RTL',
    4: 'nie znaleziono węzłów w pliku konfiguracyjnym',
    5: 'Interfejs webowy',

    // interfaces.ts
    100: 'Interfejs webowy',
    101: 'Interfejs webowy RTL',

    // actions/resetPassword.ts
    200: 'Zresetuj hasło',
    201: 'Utwórz hasło',
    202: 'Zresetuj swoje hasło do interfejsu użytkownika',
    203: 'Utwórz swoje hasło do interfejsu użytkownika',
    204: 'Utworzyć nowe hasło?',
    205: 'Sukces',
    206: 'Twoje nowe hasło znajduje się poniżej. Zapisz je w menedżerze haseł.',

    // actions/setNodes.ts
    300: 'Węzły zdalne',
    301: 'Lista węzłów Lightning do zarządzania',
    302: 'Implementacja',
    303: 'Podstawowa implementacja węzła Lightning: obecnie LND lub CLN',
    304: 'Nazwa węzła',
    305: 'Nazwa tego węzła na liście',
    306: 'Nazwa może zawierać tylko A-Z, a-z i 0-9',
    307: 'URL serwera REST',
    308: 'Pełny adres URL serwera REST twojego węzła, wraz z protokołem i portem.\nUWAGA: RTL nie obsługuje tutaj adresu URL .onion',
    309: 'Macaroon',
    310: 'Twój admin.macaroon (LND) lub access.macaroon (CLN), zakodowany w Base64URL.',
    311: 'Macaroon musi być zakodowany w formacie Base64URL (dozwolone tylko A-Z, a-z, 0-9, _, - i =)',
    312: 'Węzły wewnętrzne',
    313: '- LND: Lightning Network Daemon od Lightning Labs\n- CLN: Core Lightning od Blockstream\n',
    314: 'Ustaw węzły',
    315: 'Wybierz, którymi węzłami zarządzać z RTL',

    // manifest/index.ts
    400: 'Opcjonalnie podłącz RTL do swojego węzła CLN.',
    401: 'Opcjonalnie podłącz RTL do swojego węzła LND.',
  },
  fr_FR: {
    // main.ts
    1: "L'interface web est prête",
    2: "L'interface web n'est pas prête",
    3: 'Choisissez les nœuds que RTL gérera',
    4: 'nœuds introuvables dans le fichier de configuration',
    5: 'Interface web',

    // interfaces.ts
    100: 'Interface web',
    101: "L'interface web de RTL",

    // actions/resetPassword.ts
    200: 'Réinitialiser le mot de passe',
    201: 'Créer un mot de passe',
    202: "Réinitialiser votre mot de passe d'interface utilisateur",
    203: "Créer votre mot de passe d'interface utilisateur",
    204: 'Créer un nouveau mot de passe ?',
    205: 'Succès',
    206: 'Votre nouveau mot de passe est ci-dessous. Enregistrez-le dans un gestionnaire de mots de passe.',

    // actions/setNodes.ts
    300: 'Nœuds distants',
    301: 'Liste des nœuds Lightning à gérer',
    302: 'Implémentation',
    303: "L'implémentation sous-jacente du nœud Lightning : actuellement, LND ou CLN",
    304: 'Nom du nœud',
    305: 'Nom de ce nœud dans la liste',
    306: 'Le nom ne peut contenir que A-Z, a-z et 0-9',
    307: 'URL du serveur REST',
    308: "L'URL complète du serveur REST de votre nœud, y compris le protocole et le port.\nREMARQUE : RTL ne prend pas en charge une URL .onion ici",
    309: 'Macaroon',
    310: 'Votre admin.macaroon (LND) ou access.macaroon (CLN), encodé en Base64URL.',
    311: 'Le macaroon doit être encodé au format Base64URL (seuls A-Z, a-z, 0-9, _, - et = sont autorisés)',
    312: 'Nœuds internes',
    313: '- LND : Lightning Network Daemon de Lightning Labs\n- CLN : Core Lightning de Blockstream\n',
    314: 'Définir les nœuds',
    315: 'Choisissez les nœuds à gérer depuis RTL',

    // manifest/index.ts
    400: 'Connectez éventuellement RTL à votre nœud CLN.',
    401: 'Connectez éventuellement RTL à votre nœud LND.',
  },
} satisfies Record<string, LangDict>
