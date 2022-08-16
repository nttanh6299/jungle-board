import eventHandler from '../utils/eventHandler'
import roomMap from '../db'
import Room, { ERoomStatus } from '../models/room.model'
import Match from '../models/match.model'
import Participant, { EUserType } from '../models/participant.model'

const disconnect = eventHandler((_, socket) => {
  socket.on('disconnect', async () => {
    const { roomId = '', playerId = '' } = socket.data ?? {}
    const roomMapItem = roomMap.get(roomId)

    if (!roomMapItem) return

    const currentPlayer = roomMapItem?.players.get(playerId)
    const isPlayer = !currentPlayer?.isSpectator

    // emit to another player that we leave the room
    socket.to(roomId).emit('playerDisconnect', isPlayer)
    socket.leave(roomId)

    roomMapItem?.leave(playerId)
    if (isPlayer) {
      roomMapItem?.reset()
      roomMapItem?.clearTimer()

      // set winner to another player
      if (roomMapItem?.playerIdsCanPlay.length === 1) {
        const match = await Match.findById(roomMapItem.matchId)
        if (match) {
          console.log('room', roomMapItem)
          match.winnerId = roomMapItem.getFirstPlayer()
          match.move = roomMapItem.board.moveCount
          match.time = roomMapItem.matchTime
          await match.save()

          const players = Array.from(roomMapItem.players, ([_, player]) => player)
          const participantPromises = [...players, currentPlayer].filter(Boolean).map(
            async (player) =>
              await Participant.create({
                roomId: roomMapItem.id,
                matchId: roomMapItem.matchId,
                userType: player?.playerType,
                isSpectator: player?.isSpectator,
                createdAt: new Date(),
                ...(player?.playerType === EUserType.IDENTIFIED
                  ? { userId: player?.id }
                  : { anonymousUserId: player?.id }),
              }),
          )
          await Promise.all(participantPromises) //test win
        }
      }

      const room = await Room.findById(roomId)
      if (room) {
        room.status = ERoomStatus.WAITING
        await room.save()
      }
    }
    // if (room.players.size === 0 && room.type === 'custom') {
    //   roomMap.delete(roomId)
    // }
  })
})

export default disconnect
