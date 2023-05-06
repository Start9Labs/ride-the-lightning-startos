import { Manifest as CLNManifest } from 'c-lightning-wrapper/startos/manifest'
import { Manifest as LNDManifest } from 'lnd-wrapper/startos/manifest'

export const dependencyMounts = setupDependencyMounts<{
  'c-lightning': CLNManifest
  lnd: LNDManifest
}>({
  'c-lightning': {
    main: {
      root: {
        path: '/',
        readonly: true,
      },
    },
  },
  lnd: {
    main: {
      root: {
        path: '/',
        readonly: true,
      },
    },
  },
})
