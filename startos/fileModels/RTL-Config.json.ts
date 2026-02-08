import { matches, FileHelper } from '@start9labs/start-sdk'
import { configDefaults } from '../utils'
import { sdk } from '../sdk'

const { object, array, string, natural, oneOf, literal, literals } = matches

const { host, port, multiPass, multiPassHashed, secret2fa, SSO } = configDefaults

const { logoutRedirectLink, rtlCookiePath, rtlSSO } = SSO

// @TODO account for macaroon & rune path depending on ln implementation

const shape = object({
  host: literal(host).onMismatch(host),
  port: literal(port).onMismatch(port),
  multiPass: string.onMismatch(multiPass),
  multiPassHashed: string.onMismatch(multiPassHashed), // set by RTL
  secret2fa: string.onMismatch(secret2fa), // set by RTL
  SSO: object({
    logoutRedirectLink: literal(logoutRedirectLink),
    rtlCookiePath: literal(rtlCookiePath),
    rtlSSO: literal(rtlSSO),
  }).onMismatch(SSO),
  nodes: array(
    object({
      index: natural,
      lnImplementation: literals('LND', 'CLN').onMismatch('CLN'),
      lnNode: string, // human readable name of the node
      authentication: object({
        macaroonPath: string.optional(),
        runePath: string.optional()
      }),
      settings: object({
        themeMode: literals('DAY', 'NIGHT'),
        themeColor: literals(
          'PURPLE',
          'TEAL',
          'INDIGO',
          'PINK',
          'YELLOW',
        ),
        channelBackupPath: string,
        lnServerUrl: string,
      }),
    }),
  ),
})

export const rtlConfig = FileHelper.json({
  base: sdk.volumes.main,
  subpath: 'RTL-Config.json'
},
  shape,
)
