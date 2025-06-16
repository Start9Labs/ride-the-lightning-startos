export const uiPort = 80
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'

export type Config = {
  host: '0.0.0.0'
  port: typeof uiPort
  multiPass: string
  multiPassHashed: string // set by RTL
  secret2fa: string // set by RTL
  SSO: {
    logoutRedirectLink: string
    rtlCookiePath: string
    rtlSSO: number
  }
  nodes: {
    index: number
    lnImplementation: 'LND' | 'CLN'
    lnNode: string // human readable name of the node
    authentication: {
      macaroonPath?: string
      runePath?: string
    }
    settings: {
      themeMode: 'DAY' | 'NIGHT'
      themeColor: 'PURPLE' | 'TEAL' | 'INDIGO' | 'PINK' | 'YELLOW'
      channelBackupPath: string
      lnServerUrl: string
    }
  }[]
}

export const configDefaults: Config = {
  host: '0.0.0.0',
  port: uiPort,
  multiPass: '',
  multiPassHashed: '',
  secret2fa: '',
  SSO: {
    logoutRedirectLink: '',
    rtlCookiePath: '',
    rtlSSO: 0,
  },
  nodes: [],
}

export function hasInternal(
  nodes: Config['nodes'],
  imp: 'lnd' | 'c-lightning',
): boolean {
  return nodes.some((n) => n.settings.lnServerUrl.includes(`${imp}.startos`))
}
