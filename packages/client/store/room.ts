import create, { SetState, StateSelector } from 'zustand'
import shallow from 'zustand/shallow'

const actionNames = ['onVerifyRoom', 'onResetVerification'] as const
export type ActionNames = typeof actionNames[number]

interface State {
  actions: Record<ActionNames, (...args) => void>
  roomId: string
  valid: boolean
}

const useStoreImpl = create<State>((set: SetState<State>) => {
  const actions: Record<ActionNames, (...args) => void> = {
    onVerifyRoom: (roomId: string) => {
      set({ roomId, valid: true })
    },
    onResetVerification: () => {
      set({ roomId: '', valid: false })
    },
  }

  return {
    actions,
    roomId: '',
    valid: false,
  }
})

const useRoomStore = <T>(sel: StateSelector<State, T>) => useStoreImpl(sel, shallow)
Object.assign(useRoomStore, useStoreImpl)

const { getState, setState } = useStoreImpl
export { getState, setState, useRoomStore }
