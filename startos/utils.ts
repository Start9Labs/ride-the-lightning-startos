import { RtlConfig } from './fileModels/RTL-Config.json'

export const uiPort = 80
export const lndMountpoint = '/mnt/lnd'
export const clnMountpoint = '/mnt/cln'
export const eclairMountpoint = '/mnt/eclair'

// clnrest host id, referenced by literal: cln exports only its peer/watchtower
// host ids (see cln-startos/startos/interfaces.ts), so this one is inlined.
export const clnRestHostId = 'clnrest'

// Internal LND and CLN nodes are identified by their credential mountpoint
// (LND's macaroon under /mnt/lnd, CLN's rune under /mnt/cln), not by their
// server URL — main rewrites that URL to the dependency's live LXC-bridge
// address on every start. Eclair has no credential file, and a remote Eclair
// node cannot be configured here, so its implementation identifies it.
export function hasInternal(
  nodes: RtlConfig['nodes'],
  imp: 'lnd' | 'c-lightning' | 'eclair',
): boolean {
  switch (imp) {
    case 'lnd':
      return nodes.some((n) =>
        n.authentication.macaroonPath?.startsWith(lndMountpoint),
      )
    case 'c-lightning':
      return nodes.some((n) =>
        n.authentication.runePath?.startsWith(clnMountpoint),
      )
    case 'eclair':
      return nodes.some((n) => n.lnImplementation === 'ECL')
  }
}

// RTL sees the main volume at /root; package code reaches it here.
const VOLUME_ROOT_RTL = '/root'
const VOLUME_ROOT_DISK = '/media/startos/volumes/main'
export const toDisk = (rtlPath: string): string =>
  rtlPath.startsWith(`${VOLUME_ROOT_RTL}/`)
    ? `${VOLUME_ROOT_DISK}${rtlPath.slice(VOLUME_ROOT_RTL.length)}`
    : rtlPath

// The format RTL's getRuneValue parses.
export const runeFileContents = (rune: string) => `LIGHTNING_RUNE="${rune}"\n`
export const parseRuneFile = (contents: string) =>
  contents.match(/LIGHTNING_RUNE="([^"]+)"/)?.[1]
