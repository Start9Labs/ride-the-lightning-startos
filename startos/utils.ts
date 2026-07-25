import { sdk } from './sdk'
import { RtlConfig } from './fileModels/RTL-Config.json'

export const uiPort = 80
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'

// clnrest host id, referenced by literal: cln exports only its peer/watchtower
// host ids (see cln-startos/startos/interfaces.ts), so this one is inlined.
export const clnRestHostId = 'clnrest'

// Internal nodes are identified by their credential mountpoint (LND's macaroon
// under /mnt/lnd, CLN's rune under /mnt/cln), not by their server URL — main
// rewrites that URL to the dependency's live LXC-bridge address on every start.
export function hasInternal(
  nodes: RtlConfig['nodes'],
  imp: 'lnd' | 'c-lightning',
): boolean {
  return imp === 'lnd'
    ? nodes.some((n) =>
        n.authentication.macaroonPath?.startsWith(lndMountpoint),
      )
    : nodes.some((n) => n.authentication.runePath?.startsWith(clnMountpoint))
}
