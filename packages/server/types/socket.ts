import { Board, BoardDelta } from '../../gameService/gameLogic'

type PlayerJoinEventType = {
  bothConnected: boolean
  board: Board
}

type ReadyToPlayEventType = {
  cooldown: number
}

type StartGameEventType = {
  board: Board
  allMoves: { [key: string]: BoardDelta[] }
}

type JoinEventType = string

export interface ServerToClientEvents {
  playerJoin: (data: PlayerJoinEventType) => void
  readyToPlay: (data: ReadyToPlayEventType) => void
  startGame: (data: StartGameEventType) => void
  playerDisconnect: () => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface ClientToServerEvents {
  join: (data: JoinEventType) => void
  disconnect: () => void
}

export interface SocketData {
  roomId: string
  playerId: string
}
