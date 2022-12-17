import eventHandler from '../utils/eventHandler'
import { EUserType } from '../models/participant.model'
import { generateId } from '../utils'
import roomMap from '../db'

const PLAYER_ID_PREFIX = 'p-'

const join = eventHandler((io, socket) => {
  socket.on('join', async (roomId, accountId) => {
    const roomMapItem = roomMap.get(roomId)

    if (!roomMapItem) return

    const playerId = accountId || PLAYER_ID_PREFIX + generateId()
    const playerType = accountId ? EUserType.IDENTIFIED : EUserType.ANONYMOUS

    if (!roomMapItem.players.get(playerId)) {
      roomMapItem.addPlayer(playerId, playerType)
    }

    const bothConnected = roomMapItem.players.size === 2

    socket.join(roomMapItem.id)
    socket.data = {
      ...socket.data,
      roomId,
      playerId,
      playerType,
    }

    // send playerId to the joined player
    socket.emit('playerJoin', playerId, roomMapItem.playerIdsCanPlay.length === 1)

    // to all clients in roomId
    io.in(roomId).emit('checkRoom', roomMapItem.board.state.board, bothConnected)
  })

  socket.on('reconnect', async (roomId, playerId) => {
    const roomMapItem = roomMap.get(roomId)

    if (!roomMapItem) return

    let playerType
    if (roomMapItem.players.get(playerId)) {
      playerType = roomMapItem.players.get(playerId)?.playerType
    } else {
      playerType = playerId.substring(0, 2) !== PLAYER_ID_PREFIX ? EUserType.IDENTIFIED : EUserType.ANONYMOUS
      roomMapItem.addPlayer(playerId, playerType)
    }

    socket.join(roomMapItem.id)
    socket.data = {
      ...socket.data,
      roomId,
      playerId,
      playerType,
    }
    socket.emit('reconnectSuccess')
    console.log(`${roomId} ${playerId}: reconnect`)
  })
})

export default join
