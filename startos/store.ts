import { setupExposeStore } from '@start9labs/start-sdk'

export type Store = {
  hasPassword: boolean
}

export const initStore: Store = {
  hasPassword: false,
}

export const exposedStore = setupExposeStore<Store>(() => [])
