import { Server } from 'socket.io'
import http from 'http'
import join from './join.event'
import start from './start.event'
import move from './move.event'
import chat from './chat.event'
import disconnect from './disconnect.event'
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../types/socket'
import config from '../config/config'

const initSocketServer = (httpServer: http.Server) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
    transports: ['websocket'],
    cors: config.env === 'development' ? ['http://localhost:3000'] : config.cors,
    maxHttpBufferSize: 1e8,
    pingInterval: 5000,
    pingTimeout: 90000,
  })
  io.on('connection', (socket) => {
    console.log('Socket connected: ', socket.id)

    join(io, socket)
    start(io, socket)
    move(io, socket)
    chat(io, socket)
    disconnect(io, socket)
  })
  return io
}

export default initSocketServer
