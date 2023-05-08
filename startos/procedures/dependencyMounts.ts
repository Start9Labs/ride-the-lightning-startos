import { manifest as clnManifest } from 'c-lightning-wrapper/startos/manifest'
import { manifest as lndManifest } from 'lnd-wrapper/startos/manifest'

export const dependencyMounts = setupDependencyMounts()
  .addPath({
    name: 'root',
    manifest: clnManifest,
    volume: 'main',
    path: '/',
    readonly: true,
  })
  .addPath({
    name: 'root',
    manifest: lndManifest,
    volume: 'main',
    path: '/',
    readonly: true,
  })
