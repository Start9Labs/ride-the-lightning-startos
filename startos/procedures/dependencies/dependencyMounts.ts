import { sdk } from '../../sdk'
import { manifest as clnManifest } from 'c-lightning-wrapper/startos/manifest'
import { manifest as lndManifest } from 'lnd-wrapper/startos/manifest'

export const dependencyMounts = sdk
  .setupDependencyMounts()
  .addPath({
    name: 'rootDir',
    manifest: clnManifest,
    volume: 'main',
    path: '/',
    readonly: true,
  })
  .addPath({
    name: 'rootDir',
    manifest: lndManifest,
    volume: 'main',
    path: '/',
    readonly: true,
  })
  .build()
