import React from 'react'
import { API_ENDPOINT } from 'constants/common'
import socketIOClient, { Socket } from 'socket.io-client'
import { ServerToClientEvents, ClientToServerEvents } from 'server/types/socket'

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>

export type SocketStateContextType = {
  socket: SocketType
}

export const SocketStateContext = React.createContext<SocketStateContextType>({
  socket: null,
})

const SocketProvider: React.FC = ({ children }) => {
  const [socket, setSocket] = React.useState<SocketType>()

  React.useEffect(() => {
    const socket = socketIOClient(API_ENDPOINT, { transports: ['websocket'] })
    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])

  if (!socket) return null

  return <SocketStateContext.Provider value={{ socket }}>{children}</SocketStateContext.Provider>
}

export default SocketProvider
