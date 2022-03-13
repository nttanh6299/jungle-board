import { Server, Socket } from 'socket.io'
import { AllPossibleMoves, Board, BoardDelta } from '../../gameService/gameLogic'

export interface ServerToClientEvents {
  checkRoom: (board: Board, bothConnected: boolean) => void
  readyToPlay: (cooldown: number) => void
  playerDisconnect: (isPlayerDisconnected: boolean) => void
  playerJoin: (playerId: string, isHost: boolean) => void
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
  start: () => void
}

export interface SocketData {
  roomId: string
  playerId: string
}

export type SocketServerType = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
export type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
