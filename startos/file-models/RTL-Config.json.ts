import { matches, FileHelper } from '@start9labs/start-sdk'
import { configDefaults } from '../utils'

const { object, array, string, natural, oneOf, literal } = matches

const { host, port, multiPass, multiPassHashed, secret2fa } = configDefaults

const shape = object({
  host: literal(host).onMismatch(host),
  port: literal(port).onMismatch(port),
  multiPass: string.onMismatch(multiPass),
  multiPassHashed: string.onMismatch(multiPassHashed), // set by RTL
  secret2fa: string.onMismatch(secret2fa), // set by RTL
  nodes: array(
    object({
      index: natural,
      lnImplementation: oneOf(literal('LND'), literal('CLN')),
      lnNode: string, // human readable name of the node
      Authentication: object({
        macaroonPath: string,
      }),
      Settings: object({
        themeMode: oneOf(literal('DAY'), literal('NIGHT')),
        themeColor: oneOf(
          literal('PURPLE'),
          literal('TEAL'),
          literal('INDIGO'),
          literal('PINK'),
          literal('YELLOW'),
        ),
        channelBackupPath: string,
        lnServerUrl: string,
      }),
    }),
  ),
})

export const rtlConfig = FileHelper.json(
  '/media/startos/volumes/main/RTL-Config.json',
  shape,
)
