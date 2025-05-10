import { matches, FileHelper } from '@start9labs/start-sdk'

const { object, boolean } = matches

const shape = object({
  hassPassword: boolean.onMismatch(false),
})

export const store = FileHelper.json(
  { volumeId: 'main', subpath: '/store.json' },
  shape,
)
