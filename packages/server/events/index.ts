import { Server } from 'socket.io'
import http from 'http'
import join from './join.event'
import start from './start.event'
import move from './move.event'
import disconnect from './disconnect.event'
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types/socket'

const initSocketServer = (httpServer: http.Server) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer)
  io.on('connection', (socket) => {
    join(io, socket)
    start(io, socket)
    move(io, socket)
    disconnect(io, socket)
  })
  return io
}

export default initSocketServer
