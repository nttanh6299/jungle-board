import create, { SetState, StateSelector } from 'zustand'
import { persist } from 'zustand/middleware'
import shallow from 'zustand/shallow'
import produce from 'immer'

export const STORAGE_KEY = 'settings'

export type SettingLevel = 'low' | 'medium' | 'high'
export type AudioType = 'music' | 'sfx'

const actionNames = ['onToggleMute', 'onSetTutorials', 'onSetShowFps', 'onSetGraphicLevel', 'onSetVolume'] as const
export type ActionNames = typeof actionNames[number]

interface GameSettings {
  tutorials: boolean
}

interface AudioSettings {
  musicMuted: boolean
  musicVolume: number
  sfxMuted: boolean
  sfxVolume: number
}

interface VideoSettings {
  showFps: boolean
  graphics: SettingLevel
}

interface ControlSettings {
  up: string
  down: string
  left: string
  right: string
}

interface State {
  actions: Record<ActionNames, (...args) => void>
  openMenu: boolean
  game: GameSettings
  audio: AudioSettings
  video: VideoSettings
  control: ControlSettings
}

const useStoreImpl = create<State>(
  persist<State>(
    (set: SetState<State>) => {
      const actions: Record<ActionNames, (...args) => void> = {
        onToggleMute: (type: AudioType) => {
          const newState = produce<State>((state) => {
            if (type === 'music') {
              state.audio.musicMuted = !state.audio.musicMuted
            }
            if (type === 'sfx') {
              state.audio.sfxMuted = !state.audio.sfxMuted
            }
          })
          set(newState)
        },
        onSetVolume: (type: AudioType, value: number) => {
          const newState = produce<State>((state) => {
            if (type === 'music') {
              state.audio.musicVolume = value
            }
            if (type === 'sfx') {
              state.audio.sfxVolume = value
            }
          })
          set(newState)
        },
        onSetTutorials: (value: boolean) => {
          const newState = produce<State>((state) => {
            state.game.tutorials = value
          })
          set(newState)
        },
        onSetShowFps: (value: boolean) => {
          const newState = produce<State>((state) => {
            state.video.showFps = value
          })
          set(newState)
        },
        onSetGraphicLevel: (value: SettingLevel) => {
          const newState = produce<State>((state) => {
            state.video.graphics = value
          })
          set(newState)
        },
      }

      return {
        actions,
        openMenu: false,
        game: {
          tutorials: false,
        },
        audio: {
          musicMuted: false,
          musicVolume: 50,
          sfxMuted: false,
          sfxVolume: 50,
        },
        video: {
          showFps: false,
          graphics: 'medium',
        },
        control: {
          up: 'w',
          down: 's',
          left: 'a',
          right: 'd',
        },
      }
    },
    {
      name: STORAGE_KEY,
      getStorage: () => window.localStorage,
      partialize: (state) =>
        Object.fromEntries(Object.entries(state).filter(([key]) => !['actions', 'openMenu'].includes(key))),
    },
  ),
)

const useSettingsStore = <T>(sel: StateSelector<State, T>) => useStoreImpl(sel, shallow)
Object.assign(useSettingsStore, useStoreImpl)

const { getState, setState } = useStoreImpl
export { getState, setState, useSettingsStore }
