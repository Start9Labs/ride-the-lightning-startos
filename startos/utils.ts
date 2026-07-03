import { RtlConfig } from './fileModels/RTL-Config.json'

export const uiPort = 80
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'

// Internal nodes are identified by their credential mountpoint (LND's macaroon
// under /mnt/lnd, CLN's rune under /mnt/cln), not by their server URL — main
// rewrites that URL to the dependency's live LXC-bridge address on every start.
export function hasInternal(
  nodes: RtlConfig['nodes'],
  imp: 'lnd' | 'c-lightning',
): boolean {
  return imp === 'lnd'
    ? nodes.some((n) => n.authentication.macaroonPath?.startsWith(lndMountpoint))
    : nodes.some((n) => n.authentication.runePath?.startsWith(clnMountpoint))
}
