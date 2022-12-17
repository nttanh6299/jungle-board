import eventHandler from '../utils/eventHandler'
import roomMap from '../db'
import Room, { ERoomStatus } from '../models/room.model'
import Match from '../models/match.model'
import User from '../models/user.model'
import Participant, { EUserType } from '../models/participant.model'
import { EDisconnectReason } from '../constants/event'
import { notify, subscribe } from '../utils/subscriber'
import { SocketData, SocketServerType } from '../types/socket'

interface TryReconnect {
  io: SocketServerType
  roomId: string
  leftPlayerId: string
}
const tryReconnect = ({ io, roomId, leftPlayerId }: TryReconnect) => {
  const roomMapItem = roomMap.get(roomId)

  if (!roomMapItem) return

  let reconnectAttempt = 0

  const intervalId = setInterval(async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const sockets = await io.in(roomId).fetchSockets<SocketData>()
    const players = sockets.filter((socket) => !roomMapItem.players.get(socket.data.playerId)?.isSpectator)

    if (players.length === 2) {
      clearInterval(intervalId)
      return
    }

    if (reconnectAttempt === 5) {
      clearInterval(intervalId)

      const leftPlayer = roomMapItem.players.get(leftPlayerId)
      const isPlayer = !leftPlayer?.isSpectator

      io.in(roomId).emit('playerDisconnect', isPlayer)

      roomMapItem.leave(leftPlayerId)
      if (isPlayer) {
        roomMapItem.clearTimer()

        // set winner to another player if the match is playing
        if (roomMapItem.status === ERoomStatus.PLAYING) {
          if (roomMapItem.playerIdsCanPlay.length === 1) {
            const match = await Match.findById(roomMapItem.matchId)
            if (match) {
              match.winnerId = roomMapItem.getFirstPlayer()
              match.move = roomMapItem.board.moveCount
              match.time = roomMapItem.matchTime
              match.save()

              const players = Array.from(roomMapItem.players, ([_, player]) => player)

              const identifiedPlayersPlaying = players?.length
                ? [...players, leftPlayer].filter(
                    (player) => !player?.isSpectator && player?.playerType === EUserType.IDENTIFIED,
                  )
                : []
              const userPromises = identifiedPlayersPlaying.map(async (player) => {
                // winner is not the user has left the match
                const isWinner = player?.id !== leftPlayerId
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

              const participantPromises = players?.length
                ? [...players, leftPlayer].map(
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
                : []
              Promise.all(participantPromises)
            }

            const room = await Room.findById(roomId)
            if (room) {
              room.status = ERoomStatus.WAITING
              await room.save()
              roomMapItem.reset()
            }
          }
        }

        if (roomMapItem.players.size === 0 && roomMapItem.type === 'custom') {
          roomMap.delete(roomId)
          await Room.findByIdAndDelete(roomId)
        }
      }
    } else {
      reconnectAttempt++
    }
  }, 1000)
}

subscribe('tryReconnect', tryReconnect as any)

const disconnect = eventHandler((io, socket) => {
  socket.on('disconnect', async (reason) => {
    const { roomId = '', playerId = '' } = socket.data ?? {}
    const roomMapItem = roomMap.get(roomId)

    if (!roomMapItem) return

    const leftPlayer = roomMapItem.players.get(playerId)
    const isPlayer = !leftPlayer?.isSpectator

    const isUnknownDisconnection =
      reason === EDisconnectReason.TRANSPORT_CLOSE ||
      reason === EDisconnectReason.TRANSPORT_ERROR ||
      reason === EDisconnectReason.PING_TIMEOUT
    const canReconnect = isUnknownDisconnection && isPlayer && roomMapItem.status === ERoomStatus.PLAYING
    if (canReconnect) {
      console.log(`Room ${roomId}, Player ${playerId} disconnect: ${reason}`)
      socket.leave(roomId)
      notify('tryReconnect', { io, roomId, leftPlayerId: playerId })
      return
    }

    // emit to another player that we leave the room
    socket.to(roomId).emit('playerDisconnect', isPlayer)
    socket.leave(roomId)

    roomMapItem.leave(playerId)
    if (isPlayer) {
      roomMapItem.clearTimer()

      // set winner to another player if the match is playing
      if (roomMapItem.status === ERoomStatus.PLAYING) {
        if (roomMapItem.playerIdsCanPlay.length === 1) {
          const match = await Match.findById(roomMapItem.matchId)
          if (match) {
            match.winnerId = roomMapItem.getFirstPlayer()
            match.move = roomMapItem.board.moveCount
            match.time = roomMapItem.matchTime
            match.save()

            const players = Array.from(roomMapItem.players, ([_, player]) => player)

            const identifiedPlayersPlaying = players?.length
              ? [...players, leftPlayer].filter(
                  (player) => !player?.isSpectator && player?.playerType === EUserType.IDENTIFIED,
                )
              : []
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

            const participantPromises = players?.length
              ? [...players, leftPlayer].map(
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
              : []
            Promise.all(participantPromises)
          }

          const room = await Room.findById(roomId)
          if (room) {
            room.status = ERoomStatus.WAITING
            await room.save()
            roomMapItem.reset()
          }
        }
      }

      if (roomMapItem.players.size === 0 && roomMapItem.type === 'custom') {
        roomMap.delete(roomId)
        await Room.findByIdAndDelete(roomId)
      }
    }
  })
})

export default disconnect
