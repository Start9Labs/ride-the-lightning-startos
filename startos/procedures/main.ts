import {
  Daemons,
  NetworkInterfaceBuilder,
  setupMain,
} from 'start-sdk/lib/mainFn'
import exportInterfaces from 'start-sdk/lib/mainFn/exportInterfaces'
import { ExpectedExports } from 'start-sdk/lib/types'
import { WrapperData } from '../wrapperData'
import { HealthReceipt } from 'start-sdk/lib/health'

export const main: ExpectedExports.main = setupMain<WrapperData>(
  async ({ effects, utils, started }) => {
    /**
     * ======================== Setup ========================
     *
     * In this section, you will fetch any resources or run any commands necessary to run the service
     */

    await effects.console.info('Starting Ride The Lightning!')

    /**
     * ======================== Interfaces ========================
     *
     * In this section, you will decide how the service will be exposed to the outside world
     *
     * Naming convention reference: https://developer.mozilla.org/en-US/docs/Web/API/Location
     */

    // ------------ web interface ------------

    // tor
    const torHostname = utils.torHostName('torHostname')
    const webTorHost = await torHostname.bindTor(80, 80)
    const webTorOrigin = webTorHost.createOrigin('http')
    // lan
    const webLanHost = await utils.bindLan(80)
    const webLanOrigins = webLanHost.createOrigins('https')

    let webInterface = new NetworkInterfaceBuilder({
      effects,
      name: 'Web UI',
      id: 'webui',
      description: 'Web UI for RTL',
      ui: true,
      basic: null,
      path: '',
      search: {},
    })

    const webReceipt = await webInterface.exportAddresses([
      webTorOrigin,
      webLanOrigins.local,
      ...webLanOrigins.ipv4,
      ...webLanOrigins.ipv6,
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
    }).addDaemon('ws', {
      command: ['-g', '--', 'node', 'rtl'], // The command to start the daemon
      env: {
        HOST_IP: `$(ip -4 route list match 0/0 | awk '{print $3}')`,
        RTL_CONFIG_PATH: '/root',
      },
      requires: [],
      ready: {
        display: 'Server Ready',
        // The function to run to determine the health status of the daemon
        fn: () =>
          utils.checkPortListening(3000, {
            successMessage: 'Server is live',
            errorMessage: 'Server is unreachable',
          }),
      },
    })
  },
)
