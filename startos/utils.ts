import { RtlConfig } from './fileModels/RTL-Config.json'

export const uiPort = 80
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'

export function hasInternal(
  nodes: RtlConfig['nodes'],
  imp: 'lnd' | 'c-lightning',
): boolean {
  return nodes.some((n) => n.settings.lnServerUrl.includes(`${imp}.startos`))
}
