import eventHandler from '../utils/eventHandler'
import roomMap from '../db'
import Room, { ERoomStatus } from '../models/room.model'
import Match from '../models/match.model'
import User from '../models/user.model'
import Participant, { EUserType } from '../models/participant.model'
import { EDisconnectReason } from '../constants/event'

const disconnect = eventHandler((_, socket) => {
  socket.on('disconnect', async (reason) => {
    const { roomId = '', playerId = '' } = socket.data ?? {}
    const roomMapItem = roomMap.get(roomId)

    if (!roomMapItem) return

    // player is disconnected for some reason
    if (reason !== EDisconnectReason.CLIENT_NAMESPACE_DISCONNECT) {
      socket.emit('outWithNoReason')
    }

    const leftPlayer = roomMapItem?.players.get(playerId)
    const isPlayer = !leftPlayer?.isSpectator

    // emit to another player that we leave the room
    socket.to(roomId).emit('playerDisconnect', isPlayer)
    socket.leave(roomId)

    roomMapItem?.leave(playerId)
    if (isPlayer) {
      roomMapItem?.clearTimer()

      // set winner to another player if the match is playing
      if (roomMapItem.status === ERoomStatus.PLAYING) {
        if (roomMapItem?.playerIdsCanPlay.length === 1) {
          const match = await Match.findById(roomMapItem.matchId)
          if (match) {
            match.winnerId = roomMapItem.getFirstPlayer()
            match.move = roomMapItem.board.moveCount
            match.time = roomMapItem.matchTime
            match.save()

            const players = Array.from(roomMapItem.players, ([_, player]) => player)

            const identifiedPlayersPlaying = [...players, leftPlayer].filter(
              (player) => !player?.isSpectator && player?.playerType === EUserType.IDENTIFIED,
            )
            const userPromises = identifiedPlayersPlaying.map(async (player) => {
              // winner is not the user has left the match
              const isWinner = player?.id !== playerId
              return await User.findOneAndUpdate(
                { _id: player?.id },
                {
                  $inc: {
                    xp: isWinner ? 10 : 0,
                    win: isWinner ? 1 : 0,
                    lose: isWinner ? 0 : 1,
                    coin: isWinner ? 3 : 0,
                  },
                },
              )
            })
            Promise.all(userPromises)

            const participantPromises = [...players, leftPlayer].map(
              async (player) =>
                await Participant.create({
                  roomId: roomMapItem.id,
                  matchId: roomMapItem.matchId,
                  userType: player?.playerType,
                  isSpectator: player?.isSpectator,
                  ...(player?.playerType === EUserType.IDENTIFIED
                    ? { userId: player?.id }
                    : { anonymousUserId: player?.id }),
                }),
            )
            Promise.all(participantPromises)
          }
        }

        const room = await Room.findById(roomId)
        if (room) {
          room.status = ERoomStatus.WAITING
          await room.save()

          roomMapItem?.reset()
        }
      }
    }
    // if (room.players.size === 0 && room.type === 'custom') {
    //   roomMap.delete(roomId)
    // }
  })
})

export default disconnect
