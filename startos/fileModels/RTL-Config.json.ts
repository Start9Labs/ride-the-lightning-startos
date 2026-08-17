import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { uiPort } from '../utils'

const host = '0.0.0.0' as const

const shape = z.object({
  host: z.literal(host).catch(host),
  port: z.literal(uiPort).catch(uiPort),
  // The package writes the plaintext here; RTL hashes it into multiPassHashed
  // and blanks this field. So a blank multiPass with a populated hash is a
  // password that IS set — never read it as "no password".
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
          // Absent for an internal node until its dependency (LND/CLN) is
          // installed: main resolves the live bridge address and writes it (or
          // throws) before the daemon starts, so the daemon never runs without
          // it. A fabricated loopback placeholder would just pretend to be the
          // dependency address and could not work.
          lnServerUrl: z.string().optional(),
        }),
      }),
    )
    .catch([]),
  // Index of the node RTL selects by default. Must match one of nodes[].index
  // or RTL crashes in its logger constructor on startup. Owned here so the
  // package keeps it consistent whenever it rewrites the nodes array.
  defaultNodeIndex: z.number().int().nonnegative().catch(1),
})

export type RtlConfig = z.infer<typeof shape>

export const rtlConfig = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: 'RTL-Config.json',
  },
  shape,
)
