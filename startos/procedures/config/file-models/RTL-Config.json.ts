import { matches } from '@start9labs/start-sdk/lib'
import FileHelper from '@start9labs/start-sdk/lib/util/fileHelper'

const { object, array, string, natural, anyOf, literal, boolean } = matches

const shape = object({
  SSO: object({}),
  host: string,
  port: natural,
  multiPass: string,
  multiPassHashed: string, // set by RTL
  secret2fa: string, // set by RTL
  nodes: array(
    object({
      index: natural,
      lnImplementation: anyOf(literal('LND'), literal('CLN')),
      lnNode: string,
      Authentication: object({
        macaroonPath: string,
      }),
      Settings: object({
        themeMode: anyOf(literal('DAY'), literal('NIGHT')),
        themeColor: anyOf(
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

export type RtlConfig = typeof shape._TYPE
export const rtlConfig = FileHelper.json('RTL-Config.json', shape)
