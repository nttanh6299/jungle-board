import React, { useState, useEffect, createContext } from 'react'
import { API_ENDPOINT } from 'constants/common'
import socketIOClient, { Socket } from 'socket.io-client'
import { AllPossibleMoves, Board, BoardDelta } from 'jungle-board-service'

export interface ServerToClientEvents {
  checkRoom: (board: Board, bothConnected: boolean) => void
  readyToPlay: (cooldown: number) => void
  play: () => void
  playerDisconnect: (isPlayerDisconnected: boolean) => void
  playerJoin: (playerId: string, isHost: boolean) => void
  turn: (playerTurn: string, board: Board, allMoves: AllPossibleMoves) => void
  playCooldown: (cooldown: number) => void
  end: (playerTurn: string, status: string) => void
  reconnectSuccess: () => void
}

export interface ClientToServerEvents {
  join: (roomId: string, accountId: string) => void
  move: (moveFrom: BoardDelta, moveTo: BoardDelta) => void
  disconnect: () => void
  start: () => void
  reconnect: (roomId: string, playerId: string) => void
}

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>

export type SocketStateContextType = {
  socket: SocketType
}

export const SocketStateContext = createContext<SocketStateContextType>({
  socket: null,
})

const SocketProvider: React.FC = ({ children }) => {
  const [socket, setSocket] = useState<SocketType>()

  useEffect(() => {
    const socket = socketIOClient(API_ENDPOINT, { transports: ['websocket'], reconnection: false })
    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])

  if (!socket) return null

  return <SocketStateContext.Provider value={{ socket }}>{children}</SocketStateContext.Provider>
}

export default SocketProvider
