import { T } from '@start9labs/start-sdk'
import { sdk } from './sdk'
import { RtlConfig } from './fileModels/RTL-Config.json'

export const uiPort = 80
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'

// clnrest host id, referenced by literal: cln exports only its peer/watchtower
// host ids (see cln-startos/startos/interfaces.ts), so this one is inlined.
export const clnRestHostId = 'clnrest'

/**
 * Bridge address (`10.0.3.1:<assigned external port>`) of a dependency's
 * binding, as a minimal reactive value. Chain `.const()` in main: the mapped
 * string only changes when the address itself does, so main restarts exactly
 * on dependency install/uninstall/port-change and never on dependency
 * updates. Chain `.once()` in an action context. `fallbackPort` keeps the
 * value non-null while the dependency is absent — sanctioned only for tor's
 * allocator-guaranteed SOCKS 9050. Drop-in for the planned SDK
 * `sdk.host.getBridgeAddress` helper.
 */
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort: number
  },
): { const(): Promise<string>; once(): Promise<string> }
export function bridgeAddress(
  effects: T.Effects,
  opts: { packageId: string; hostId: string; internalPort: number },
): { const(): Promise<string | null>; once(): Promise<string | null> }
export function bridgeAddress(
  effects: T.Effects,
  opts: {
    packageId: string
    hostId: string
    internalPort: number
    fallbackPort?: number
  },
) {
  const watchable = async () => {
    const osIp = await sdk.getOsIp(effects)
    return sdk.host.get(
      effects,
      { packageId: opts.packageId, hostId: opts.hostId },
      (host) => {
        const port =
          host?.bindings[opts.internalPort]?.net.assignedPort ??
          opts.fallbackPort
        return port != null ? `${osIp}:${port}` : null
      },
    )
  }
  return {
    const: async () => (await watchable()).const(),
    once: async () => (await watchable()).once(),
  }
}

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
