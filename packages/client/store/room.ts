import { ResGetRoom } from 'apis/room'
import create, { SetState, StateSelector } from 'zustand'
import shallow from 'zustand/shallow'

const actionNames = ['onVerifyRoom', 'onResetVerification'] as const
export type ActionNames = typeof actionNames[number]

interface State {
  actions: Record<ActionNames, (...args) => void>
  room: ResGetRoom
  valid: boolean
}

const useStoreImpl = create<State>((set: SetState<State>) => {
  const actions: Record<ActionNames, (...args) => void> = {
    onVerifyRoom: (room: ResGetRoom) => {
      set({ room, valid: true })
    },
    onResetVerification: () => {
      set({ room: null, valid: false })
    },
  }

  return {
    actions,
    room: null,
    valid: false,
  }
})

const useRoomStore = <T>(sel: StateSelector<State, T>) => useStoreImpl(sel, shallow)
Object.assign(useRoomStore, useStoreImpl)

const { getState, setState } = useStoreImpl
export { getState, setState, useRoomStore }
