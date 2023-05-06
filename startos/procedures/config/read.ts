import { ConfigSpec } from './spec'
import { WrapperData } from '../../wrapperData'
import { Read } from '@start9labs/start-sdk/lib/config/setupConfig'
import { rtlConfig } from './file-models/RTL-Config.json'
import { readFileSync } from 'fs'

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
    internalLnd: nodes.some((n) => n.index === 1),
    internalCln: nodes.some((n) => n.index === 2),
    remoteNodes: nodes
      .filter((n) => ![1, 2].includes(n.index))
      .map((n) => ({
        implementation: n.ln_implementation === 0 ? 'lnd' : 'cln',
        ln_node: n.ln_node,
        ln_server_url: n.Settings.ln_server_url,
        macaroon: readFileSync(n.Authentication.macaroon_path, {
          encoding: 'base64',
        }),
      })),
  }
}
