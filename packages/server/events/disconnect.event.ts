import eventHandler from '../utils/eventHandler'
import roomMap from '../db'

const disconnect = eventHandler((_, socket) => {
  socket.on('disconnect', () => {
    const { roomId = '', playerId = '' } = socket.data ?? {}
    const room = roomMap.get(roomId)
    if (room) {
      // emit to another player that we leave the room
      socket.to(roomId).emit('playerDisconnect', !room.players.get(playerId)?.isGuest)
      socket.leave(roomId)

      room.leave(playerId)
      room.reset()
      room.clearTimer()

      if (room.players.size === 0 && room.type === 'custom') {
        roomMap.delete(roomId)
      }
    }
  })
})

export default disconnect
