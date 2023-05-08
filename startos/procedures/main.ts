import { setupMain } from '@start9labs/start-sdk/lib/mainFn'
import exportInterfaces from '@start9labs/start-sdk/lib/mainFn/exportInterfaces'
import { ExpectedExports } from '@start9labs/start-sdk/lib/types'
import { WrapperData } from '../wrapperData'
import { manifest } from '../manifest'
import { NetworkInterfaceBuilder } from '@start9labs/start-sdk/lib/mainFn/NetworkInterfaceBuilder'
import { HealthReceipt } from '@start9labs/start-sdk/lib/health/HealthReceipt'
import { Daemons } from '@start9labs/start-sdk/lib/mainFn/Daemons'
import { dependencyMounts } from './dependencyMounts'
import { rtlConfig } from './config/file-models/RTL-Config.json'
import { hasInternal } from '../utils'

export const main: ExpectedExports.main = setupMain<WrapperData>(
  async ({ effects, utils, started }) => {
    /**
     * ======================== Setup ========================
     *
     * In this section, you will fetch any resources or run any commands necessary to run the service
     */

    console.info('Starting Ride The Lightning!')

    const { nodes } = (await rtlConfig.read(effects))!

    if (hasInternal(nodes, 'lnd')) {
      await utils.mountDependency(dependencyMounts.lnd)
    }

    if (hasInternal(nodes, 'c-lightning')) {
      await utils.mountDependency(dependencyMounts['c-lightning'])
    }

    /**
     * ======================== Interfaces ========================
     *
     * In this section, you will decide how the service will be exposed to the outside world
     *
     * Naming convention reference: https://developer.mozilla.org/en-US/docs/Web/API/Location
     */

    // set up a reverse proxy to enable https for LAN
    // await effects.reverseProxy({
    //   bind: {
    //     port: 443,
    //     ssl: true,
    //   },
    //   dst: {
    //     port: 80,
    //     ssl: false,
    //   },
    // })

    // ------------ web interface ------------

    // tor
    const multiHostname = utils.getMultiHostname('multi')
    const multiBindingHttp = await multiHostname.bindHttp({
      internal: 80,
      external: 80,
    })
    bindHttp = async (port: number) => {
      await effects.reverseProxy({
        bind: {
          port: 443,
          ssl: true,
        },
        dst: {
          port,
          ssl: false,
        },
      })
      await multiHostname.bind({
        protocol: 'http',
        internal: 80,
        preferredExternal: 80,
      })
      await multiHostname.bind({
        protocol: 'https',
        internal: 443,
        preferredExternal: 443,
      })
    }
    const multiBinding = await multiHostname.bind({
      protocol: 'ssh',
      internal: 22,
      external: 22, // requested external
    })

    const torHostname = utils.torHostName('torHostname')
    const torHostTcp = await torHostname.bindTor(80, 80)
    const torOriginHttp = torHostTcp.createOrigin('http')
    // lan
    const lanHostSsl = await utils.bindLan(443)
    const lanOriginsHttps = lanHostSsl.createOrigins('https')

    let webInterface = new NetworkInterfaceBuilder({
      effects,
      name: 'Web UI',
      id: 'webui',
      description: 'Web UI for RTL',
      ui: true,
      username: null,
      path: '',
      search: {},
    })

    const webReceipt = await webInterface.export([
      torOriginHttp,
      ...lanOriginsHttps.all,
    ])

    // Export all address receipts for all interfaces to obtain interface receipt
    const interfaceReceipt = exportInterfaces(webReceipt)

    /**
     * ======================== Additional Health Checks (optional) ========================
     *
     * In this section, you will define additional health checks beyond those associated with daemons
     */
    const healthReceipts: HealthReceipt[] = []

    /**
     * ======================== Daemons ========================
     *
     * In this section, you will create one or more daemons that define the service runtime
     *
     * Each daemon defines its own health check, which can optionally be exposed to the user
     */

    return Daemons.of({
      effects,
      started,
      interfaceReceipt, // Provide the interfaceReceipt to prove it was completed
      healthReceipts, // Provide the healthReceipts or [] to prove they were at least considered
    }).addDaemon('main', {
      command: ['node', 'rtl'], // The command to start the daemon
      env: {
        RTL_CONFIG_PATH: '/root',
      },
      requires: [],
      ready: {
        display: 'Service Ready',
        // The function to run to determine the health status of the daemon
        fn: () =>
          utils.checkPortListening(80, {
            successMessage: `${manifest.title} is live`,
            errorMessage: `${manifest.title} is unreachable`,
          }),
      },
    })
  },
)
