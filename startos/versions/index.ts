import { VersionGraph } from '@start9labs/start-sdk'
import { v_0_15_8_3 } from './v0.15.8.3'
import { v_0_15_8_4 } from './v0.15.8.4'

export const versionGraph = VersionGraph.of({
  current: v_0_15_8_4,
  other: [v_0_15_8_3],
})
