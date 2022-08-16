import eventHandler from '../utils/eventHandler'
import { EUserType } from '../models/participant.model'
import { generateId } from '../utils'
import roomMap from '../db'

const join = eventHandler((io, socket) => {
  socket.on('join', async (roomId, accountId) => {
    const roomMapItem = roomMap.get(roomId)!

    if (!roomMapItem) return

    const playerId = accountId || `p-${generateId()}`
    const playerType = accountId ? EUserType.IDENTIFIED : EUserType.ANONYMOUS

    if (!roomMapItem.players.get(playerId)) {
      roomMapItem.addPlayer(playerId, playerType)
    }

    const bothConnected = roomMapItem.players.size === 2

    socket.join(roomMapItem.id)
    socket.data = {
      ...socket.data,
      roomId: roomMapItem.id,
      playerId: playerId,
      playerType,
    }

    // send playerId to the joined player
    socket.emit('playerJoin', playerId, roomMapItem.playerIdsCanPlay.length === 1)

    // to all clients in roomId
    io.in(roomId).emit('checkRoom', roomMapItem.board.state.board, bothConnected)
  })
})

export default join
