import { SocketServerType, SocketType } from '../types/socket'

const eventHandler =
  (fn: (io: SocketServerType, socket: SocketType) => void) => (io: SocketServerType, socket: SocketType) => {
    fn(io, socket)
  }

export default eventHandler
