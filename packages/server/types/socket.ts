import { AllPossibleMoves, Board, BoardDelta } from '../../gameService/gameLogic'

export interface ServerToClientEvents {
  checkRoom: (board: Board, bothConnected: boolean) => void
  readyToPlay: (cooldown: number) => void
  startGame: (board: Board, allMoves: AllPossibleMoves) => void
  playerDisconnect: () => void
  playerJoin: (playerId: string) => void
  turn: (playerTurn: string, board: Board, allMoves: AllPossibleMoves) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface ClientToServerEvents {
  join: (roomId: string) => void
  move: (playerTurn: string, moveFrom: BoardDelta, moveTo: BoardDelta) => void
  disconnect: () => void
}

export interface SocketData {
  roomId: string
  playerId: string
}
