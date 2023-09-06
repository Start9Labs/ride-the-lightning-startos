import { RtlConfig } from './procedures/config/file-models/RTL-Config.json'

export const randomPassword = {
  charset: 'a-z,A-Z,1-9,!,@,$,%,&,*',
  len: 22,
}

export function hasInternal(
  nodes: RtlConfig['nodes'],
  imp: 'lnd' | 'c-lightning',
): boolean {
  return nodes.some((n) => n.Settings.lnServerUrl.includes(`${imp}.embassy`))
}
