import { AllPossibleMoves, Board, BoardDelta } from '../../gameService/gameLogic'

export interface ServerToClientEvents {
  checkRoom: (board: Board, bothConnected: boolean) => void
  readyToPlay: (cooldown: number) => void
  playerDisconnect: () => void
  playerJoin: (playerId: string) => void
  turn: (playerTurn: string, board: Board, allMoves: AllPossibleMoves) => void
  playCooldown: (cooldown: number) => void
  end: (playerTurn: string, status: string) => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface ClientToServerEvents {
  join: (roomId: string) => void
  move: (moveFrom: BoardDelta, moveTo: BoardDelta) => void
  disconnect: () => void
}

export interface SocketData {
  roomId: string
  playerId: string
}
