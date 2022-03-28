import eventHandler from '../utils/eventHandler'
import roomMap from '../db'
import { generateId } from '../utils'

const join = eventHandler((io, socket) => {
  socket.on('join', (roomId) => {
    const room = roomMap.get(roomId)

    if (!room) return

    const playerId = `p-${generateId()}`
    const player = room.join(playerId)
    const bothConnected = room.players.size === room.maxPlayer
    if (player) {
      socket.join(room.id)
      socket.data = {
        ...socket.data,
        roomId: room.id,
        playerId: playerId,
      }

      // send playerId to the joined player
      socket.emit('playerJoin', playerId, room.playerIdsCanPlay.length === 1)

      // to all clients in roomId
      io.in(roomId).emit('checkRoom', room.board.state.board, bothConnected)
    }
  })
})

export default join
