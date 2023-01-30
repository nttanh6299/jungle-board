import { ResGetTheme } from 'apis/item'
import create, { GetState, SetState, StateSelector } from 'zustand'
import shallow from 'zustand/shallow'

const actionNames = ['onSetThemes'] as const
export type ActionNames = typeof actionNames[number]

interface State {
  actions: Record<ActionNames, (...args) => void>
  themes: ResGetTheme[]
}

const useThemeImpl = create<State>((set: SetState<State>, _: GetState<State>) => {
  const actions: Record<ActionNames, (...args) => void> = {
    onSetThemes: (themes: ResGetTheme[]) => {
      set({ themes })
    },
  }

  return {
    actions,
    themes: [],
  }
})

const useThemeStore = <T>(sel: StateSelector<State, T>) => useThemeImpl(sel, shallow)
Object.assign(useThemeStore, useThemeImpl)

const { getState, setState } = useThemeImpl
export { getState, setState, useThemeStore }
