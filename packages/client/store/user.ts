import { UserInfo } from 'apis/auth'
import create, { GetState, SetState, StateSelector } from 'zustand'
import shallow from 'zustand/shallow'

const actionNames = ['onSetUser'] as const
export type ActionNames = typeof actionNames[number]

interface State {
  actions: Record<ActionNames, (...args) => void>
  user: UserInfo
}

const useStoreImpl = create<State>((set: SetState<State>, get: GetState<State>) => {
  const actions: Record<ActionNames, (...args) => void> = {
    onSetUser: (user: UserInfo) => {
      const state = get()
      if (state.user) {
        set({ user: { ...state.user, ...user } })
      } else {
        set({ user })
      }
    },
  }

  return {
    actions,
    user: null,
  }
})

const useUserStore = <T>(sel: StateSelector<State, T>) => useStoreImpl(sel, shallow)
Object.assign(useUserStore, useStoreImpl)

const { getState, setState } = useStoreImpl
export { getState, setState, useUserStore }
