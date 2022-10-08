import { createRef, MutableRefObject } from 'react'
import create, { SetState, GetState, StateSelector } from 'zustand'
import shallow from 'zustand/shallow'
import produce from 'immer'
import { AllPossibleMoves, Board } from 'jungle-board-service'
import { ERoomStatus } from 'constants/enum'

const actionNames = [
  'onSelectSquare',
  'onStartGame',
  'onEndGame',
  'onAfterEndGame',
  'onConnect',
  'onPlayerJoin',
  'onCheckRoom',
  'onReadyToPlay',
  'onPlayCooldown',
  'onNewTurn',
  'onDisconnect',
] as const
export type ActionNames = typeof actionNames[number]

const booleans = ['canConnect', 'bothConnected', 'isHost', 'cooldownMenuVisible', 'endVisible'] as const
type Booleans = typeof booleans[number]

type BaseState = {
  [K in Booleans]: boolean
}

interface State extends BaseState {
  actions: Record<ActionNames, (...args) => void>
  playerId: string
  playerTurn: string
  lastTurn: string
  board: Board
  possibleMoves: AllPossibleMoves
  selectedSquare: number[]
  cooldown: number
  playCooldown: number
  gameStatus: ERoomStatus
  initialBoard: MutableRefObject<Board>
}

const useStoreImpl = create<State>((set: SetState<State>, get: GetState<State>) => {
  const actions: Record<ActionNames, (...args) => void> = {
    onSelectSquare: (newSquare: number[]) => {
      set({ selectedSquare: newSquare })
    },
    onStartGame: () => {
      set({ gameStatus: ERoomStatus.PLAYING })
    },
    onEndGame: (lastTurn: string, status: string) => {
      set({
        playerTurn: '',
        selectedSquare: [],
        endVisible: true,
        gameStatus: status === ERoomStatus.END ? ERoomStatus.END : ERoomStatus.TIE,
        lastTurn,
      })
    },
    onAfterEndGame: () => {
      const { initialBoard } = get()
      set({ endVisible: false, board: initialBoard.current, gameStatus: ERoomStatus.WAITING, lastTurn: '' })
    },
    onConnect: () => {
      set({ canConnect: true })
    },
    onPlayerJoin: (playerId: string, isHost: boolean) => {
      set({ playerId, isHost })
    },
    onCheckRoom: (board: Board, bothConnected: boolean) => {
      const newState = produce((state: State) => {
        if (bothConnected) {
          state.bothConnected = true
        }
        if (board) {
          if (!state.initialBoard.current) {
            state.initialBoard.current = board
          }
          state.board = board
        }
      })
      set(newState)
    },
    onReadyToPlay: (cooldown: number) => {
      const { gameStatus } = get()
      set({
        cooldown,
        endVisible: false,
        cooldownMenuVisible: cooldown > 0,
        gameStatus: cooldown === 0 ? ERoomStatus.READY : gameStatus,
      })
    },
    onPlayCooldown: (playCooldown: number) => {
      set({ playCooldown })
    },
    onNewTurn: (playerIdTurn: string, board: Board, allMoves: AllPossibleMoves) => {
      set({ playerTurn: playerIdTurn, possibleMoves: allMoves, selectedSquare: [], board })
    },
    onDisconnect: (force?: boolean) => {
      const { initialBoard, canConnect } = get()
      set({
        bothConnected: false,
        cooldown: 0,
        cooldownMenuVisible: false,
        isHost: true,
        board: initialBoard.current,
        selectedSquare: [],
        playerTurn: '',
        lastTurn: '',
        gameStatus: ERoomStatus.WAITING,
        canConnect: force ? false : canConnect,
      })
    },
  }

  return {
    actions,
    canConnect: false,
    bothConnected: false,
    isHost: false,
    cooldownMenuVisible: false,
    endVisible: false,
    playerId: '',
    playerTurn: '',
    lastTurn: '',
    board: null,
    possibleMoves: null,
    selectedSquare: [],
    cooldown: 0,
    playCooldown: 0,
    gameStatus: ERoomStatus.WAITING,
    initialBoard: createRef<Board>(),
  }
})

const useGameStore = <T>(sel: StateSelector<State, T>) => useStoreImpl(sel, shallow)
Object.assign(useGameStore, useStoreImpl)

const { getState, setState } = useStoreImpl
export { getState, setState, useGameStore }
