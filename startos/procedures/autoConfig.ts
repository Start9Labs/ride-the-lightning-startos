import { setupAutoConfig } from 'start-sdk/lib/autoconfig'
import { ConfigSpec } from './config/spec'
import { WrapperData } from '../wrapperData'
import { Manifest } from '../manifest'
import { ConfigSpec as CLNSpec } from 'c-lightning-wrapper/startos/procedures/config/spec'

/**
 * In this function, you establish rules for auto configuring service dependencies
 *
 * See Hello Moon for an example
 */
export const autoConfig = setupAutoConfig<
  // @TODO we need to set the error message when config not met
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
