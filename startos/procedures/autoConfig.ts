import { ConfigSpec } from './config/spec'
import { WrapperData } from '../wrapperData'
import { Manifest } from '../manifest'
import { setupAutoConfig } from '@start9labs/start-sdk/lib/autoconfig/setupAutoConfig'
import { ConfigSpec as CLNSpec } from 'c-lightning-wrapper/startos/procedures/config/spec'

/**
 * In this function, you establish rules for auto configuring service dependencies
 *
 * See Hello Moon for an example
 */
export const autoConfig = setupAutoConfig<
  WrapperData,
  ConfigSpec,
  Manifest,
  { 'c-lightning': CLNSpec }
>({
  'c-lightning': async ({ effects, utils, localConfig, remoteConfig }) => {
    return {
      advanced: {
        plugins: {
          rest: true,
        },
      },
    }
  },
})