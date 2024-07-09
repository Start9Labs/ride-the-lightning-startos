import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, array, string, natural, anyOf, literal } = matches

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
      lnNode: string, // human readable name of the node
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