export const uiPort = 80

export type Config = {
  host: '0.0.0.0'
  port: typeof uiPort
  multiPass: string
  multiPassHashed: string // set by RTL
  secret2fa: string // set by RTL
  nodes: {
    index: number
    lnImplementation: 'LND' | 'CLN'
    lnNode: string // human readable name of the node
    Authentication: {
      macaroonPath: string
    }
    Settings: {
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
  nodes: [],
}

export function hasInternal(
  nodes: Config['nodes'],
  imp: 'lnd' | 'c-lightning',
): boolean {
  return nodes.some((n) => n.Settings.lnServerUrl.includes(`${imp}.startos`))
}
