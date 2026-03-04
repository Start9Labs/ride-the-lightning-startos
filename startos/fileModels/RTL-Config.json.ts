import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { uiPort } from '../utils'

const host = '0.0.0.0' as const

const shape = z.object({
  host: z.literal(host).catch(host),
  port: z.literal(uiPort).catch(uiPort),
  multiPass: z.string().catch(''),
  multiPassHashed: z.string().catch(''), // set by RTL
  secret2fa: z.string().catch(''), // set by RTL
  SSO: z
    .object({
      logoutRedirectLink: z.literal('').catch(''),
      rtlCookiePath: z.literal('').catch(''),
      rtlSSO: z.literal(0).catch(0),
    })
    .catch({
      logoutRedirectLink: '',
      rtlCookiePath: '',
      rtlSSO: 0,
    }),
  nodes: z
    .array(
      z.object({
        index: z.number().int().nonnegative(),
        lnImplementation: z.enum(['LND', 'CLN']).catch('CLN'),
        lnNode: z.string(),
        authentication: z.object({
          macaroonPath: z.string().optional(),
          runePath: z.string().optional(),
        }),
        settings: z.object({
          themeMode: z.enum(['DAY', 'NIGHT']),
          themeColor: z.enum(['PURPLE', 'TEAL', 'INDIGO', 'PINK', 'YELLOW']),
          channelBackupPath: z.string(),
          lnServerUrl: z.string(),
        }),
      }),
    )
    .catch([]),
})

export type RtlConfig = z.infer<typeof shape>

export const rtlConfig = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: 'RTL-Config.json',
  },
  shape,
)
