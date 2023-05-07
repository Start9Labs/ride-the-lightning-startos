import { ConfigSpec } from './spec'
import { WrapperData } from '../../wrapperData'
import { Read } from '@start9labs/start-sdk/lib/config/setupConfig'
import { rtlConfig } from './file-models/RTL-Config.json'
import { readFile } from 'fs/promises'
import { hasInternal } from '../../utils'

/**
 * This function executes on config get
 *
 * Use this function to gather data from various files and assemble into a valid config to display to the user
 */
export const read: Read<WrapperData, ConfigSpec> = async ({
  effects,
  utils,
}) => {
  const { nodes } = (await rtlConfig.read(effects))!

  return {
    internalLnd: hasInternal(nodes, 'lnd'),
    internalCln: hasInternal(nodes, 'c-lightning'),
    remoteNodes: await Promise.all(
      nodes
        .filter(
          (n) =>
            !n.Settings.lnServerUrl.includes('lnd.embassy') &&
            !n.Settings.lnServerUrl.includes('c-lightning.embassy'),
        )
        .map(async (n) => ({
          lnImplementation: n.lnImplementation,
          lnNode: n.lnNode,
          lnServerUrl: n.Settings.lnServerUrl,
          macaroon: await readFile(n.Authentication.macaroonPath, {
            encoding: 'base64',
          }),
        })),
    ),
  }
}
