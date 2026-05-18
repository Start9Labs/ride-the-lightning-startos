import { sdk } from './sdk'
import { rtlConfig } from './fileModels/RTL-Config.json'
import { clnMountpoint, hasInternal, lndMountpoint, uiPort } from './utils'
import { manifest as lndManifest } from 'lnd-startos/startos/manifest'
import { manifest as clnManifest } from 'cln-startos/startos/manifest'
import { readFile } from 'fs/promises'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Ride The Lightning...')

  let mounts = sdk.Mounts.of().mountVolume({
    volumeId: 'main',
    subpath: null,
    mountpoint: '/root',
    readonly: false,
  })

  const config = await rtlConfig.read().const(effects)
  const nodes = config?.nodes
  if (!nodes?.length) {
    throw new Error('No nodes configured. Run the "Set Nodes" action first.')
  }

  const hasLnd = hasInternal(nodes, 'lnd')
  const hasCln = hasInternal(nodes, 'c-lightning')

  if (hasLnd) {
    mounts = mounts.mountDependency<typeof lndManifest>({
      dependencyId: 'lnd',
      volumeId: 'main',
      subpath: null,
      mountpoint: lndMountpoint,
      readonly: true,
    })
  }

  if (hasCln) {
    mounts = mounts.mountDependency<typeof clnManifest>({
      dependencyId: 'c-lightning',
      volumeId: 'main',
      subpath: null,
      mountpoint: clnMountpoint,
      readonly: true,
    })
  }

  const rtlSub = await sdk.SubContainer.of(
    effects,
    { imageId: 'rtl' },
    mounts,
    'rtl-sub',
  )

  if (hasCln) {
    // Upstream RTL's setOptions caches per-node auth on first request and never
    // re-reads runePath if the first read fails or yields no LIGHTNING_RUNE
    // line. CLN writes .commando-env from a oneshot that races RTL startup, so
    // wait here until the file has the rune line before letting the daemon run.
    const runePath = `${rtlSub.rootfs}${clnMountpoint}/.commando-env`
    const deadline = Date.now() + 120_000
    while (true) {
      try {
        const contents = await readFile(runePath, 'utf-8')
        if (/LIGHTNING_RUNE="[^"]+"/.test(contents)) break
      } catch {}
      if (Date.now() > deadline) {
        throw new Error(
          `Timed out waiting for CLN rune at ${clnMountpoint}/.commando-env`,
        )
      }
      console.info(`Waiting for CLN rune at ${clnMountpoint}/.commando-env...`)
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  /**
   * ======================== Daemons ========================
   */
  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: rtlSub,
    exec: {
      command: ['node', 'rtl'],
      env: {
        RTL_CONFIG_PATH: '/root',
      },
    },
    ready: {
      display: 'Web Interface',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: 'The web interface is ready',
          errorMessage: 'The web interface is not ready',
        }),
    },
    requires: [],
  })
})
