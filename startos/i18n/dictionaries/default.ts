export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'The web interface is ready': 1,
  'The web interface is not ready': 2,
  'Choose which nodes RTL will manage': 3,
  'nodes not found in config file': 4,
  'Web Interface': 5,

  // interfaces.ts
  'Web UI': 100,
  'The web interface of RTL': 101,

  // actions/resetPassword.ts
  'Reset Password': 200,
  'Create Password': 201,
  'Reset your user interface password': 202,
  'Create your user interface password': 203,
  'Create new password?': 204,
  'Success': 205,
  'Your new password is below. Save it to a password manager.': 206,

  // actions/setNodes.ts
  'Remote Nodes': 300,
  'List of lightning nodes to manage': 301,
  'Implementation': 302,
  'The underlying lightning node implementation: currently, LND or CLN': 303,
  'Node Name': 304,
  'Name of this node in the list': 305,
  'Name can only contain A-Z, a-z, and 0-9': 306,
  'REST Server URL': 307,
  "The fully qualified URL of your node's REST server, including protocol and port.\nNOTE: RTL does not support a .onion URL here": 308,
  'Macaroon': 309,
  'Your admin.macaroon (LND) or access.macaroon (CLN), Base64URL encoded.': 310,
  'Macaroon must be encoded in Base64URL format (only A-Z, a-z, 0-9, _, - and = allowed)': 311,
  'Internal Nodes': 312,
  '- LND: Lightning Network Daemon from Lightning Labs\n- CLN: Core Lightning from Blockstream\n': 313,
  'Set Nodes': 314,
  'Choose which nodes to manage from RTL': 315,

  // manifest/index.ts
  'Optionally connect RTL to your CLN node.': 400,
  'Optionally connect RTL to your LND node.': 401,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
