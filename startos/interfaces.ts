import { sdk } from './sdk'
import { configSpec } from './config/spec'

export const uiPort = 8080
export const webUiInterfaceId = 'webui'

/**
 * ======================== Service Interfaces ========================
 */
export const setInterfaces = sdk.setupInterfaces(
  configSpec,
  async ({ effects, input }) => {
    const uiMulti = sdk.host.multi(effects, 'multi')
    const uiMultiOrigin = await uiMulti.bindPort(uiPort, { protocol: 'http' })
    const ui = sdk.createInterface(effects, {
      name: 'Web UI',
      id: webUiInterfaceId,
      description: 'The web interface of RTL',
      hasPrimary: false,
      disabled: false,
      type: 'ui',
      schemeOverride: null,
      masked: false,
      username: null,
      path: '',
      search: {},
    })

    const multiReceipt = await uiMultiOrigin.export([ui])

    return [multiReceipt]
  },
)
