import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_15_8_9 } from './v0.15.8_9'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_15_8_9],
})
