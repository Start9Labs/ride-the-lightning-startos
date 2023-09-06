import { sdk } from '../../sdk'
import { configSpec } from './spec'
import { rtlConfig } from './file-models/RTL-Config.json'
import { readFile } from 'fs/promises'
import { hasInternal } from '../../utils'

export const read = sdk.setupConfigRead(
  configSpec,
  async ({ effects, utils }) => {
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
  },
)
