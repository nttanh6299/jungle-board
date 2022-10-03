import eventHandler from '../utils/eventHandler'
import roomMap from '../db'
import { START_COOLDOWN } from '../constants/common'
import Room, { ERoomStatus } from '../models/room.model'
import Match from '../models/match.model'
import User from '../models/user.model'
import Participant, { EUserType } from '../models/participant.model'
import { SocketServerType, SocketType } from '../types/socket'
import RoomResolver from '../resolvers/Room'

const play = (io: SocketServerType, socket: SocketType, roomMapItem: RoomResolver) => {
  const { roomId = '', playerId = '' } = socket.data ?? {}
  roomMapItem.clearTimer()

  let playCooldown = roomMapItem.cooldown
  io.in(roomId).emit('playCooldown', playCooldown)
  const timer = setInterval(async () => {
    if (playCooldown > 0) {
      playCooldown -= 1
      roomMapItem.incrementPlayTime()

      if (roomMapItem.isTimeOut()) {
        roomMapItem.clearTimer()
        roomMapItem.tie()

        const match = await Match.findById(roomMapItem.matchId)
        if (match) {
          match.isTie = true
          match.move = roomMapItem.board.moveCount
          match.time = roomMapItem.matchTime
          match.save()

          const players = Array.from(roomMapItem.players, ([_, player]) => player)
          const identifiedPlayersPlaying = players.filter(
            (player) => !player.isSpectator && player.playerType === EUserType.IDENTIFIED,
          )
          const userPromises = identifiedPlayersPlaying.map(async (player) => {
            return await User.findOneAndUpdate(
              { _id: player.id },
              {
                $inc: {
                  xp: 5,
                  win: 0,
                  lose: 0,
                  tie: 1,
                  coin: 2,
                },
              },
            )
          })
          Promise.all(userPromises)

          const participantPromises = players.map(
            async (player) =>
              await Participant.create({
                roomId: roomMapItem.id,
                matchId: roomMapItem.matchId,
                userType: player.playerType,
                isSpectator: player.isSpectator,
                ...(player.playerType === EUserType.IDENTIFIED
                  ? { userId: player.id }
                  : { anonymousUserId: player.id }),
              }),
          )
          Promise.all(participantPromises)
        }

        io.in(roomId).emit('end', playerId, roomMapItem.status)

        const room = await Room.findById(roomId)
        if (room) {
          room.status = ERoomStatus.WAITING
          await room.save()

          roomMapItem.reset()
        }
      }
    }

    // keep counting down while the player does not any move
    // otherwise we stop running the event there and start counting in move event (see: ./move.event.ts)
    if (roomMapItem.board.moveCount === 0 && playCooldown >= 0) {
      io.in(roomId).emit('playCooldown', playCooldown)
    }

    // swap turn and keep counting down the timer
    if (playCooldown === 0) {
      playCooldown = -1
      roomMapItem.clearTimer()

      if (roomMapItem.status === ERoomStatus.PLAYING && roomMapItem.board.moveCount === 0) {
        io.in(roomId).emit(
          'turn',
          roomMapItem.getNextTurn(),
          roomMapItem.board.state.board,
          roomMapItem.board.getAllMoves(roomMapItem.board.state.board),
        )
        play(io, socket, roomMapItem)
      }
    }
  }, 1000)
  roomMapItem.setTimer(timer)
}

const start = eventHandler((io, socket) => {
  socket.on('start', async () => {
    const { roomId = '' } = socket.data ?? {}
    const roomMapItem = roomMap.get(roomId)

    if (!roomMapItem) return

    const bothConnected = roomMapItem.players.size === roomMapItem.maxPlayer
    if (!bothConnected) return

    let cooldown = START_COOLDOWN
    io.in(roomId).volatile.emit('readyToPlay', cooldown)
    const timer = setInterval(async () => {
      if (cooldown > 0) {
        cooldown -= 1
      }

      if (cooldown >= 0) {
        io.in(roomId).volatile.emit('readyToPlay', cooldown)
      }

      if (cooldown === 0) {
        cooldown = -1

        const room = await Room.findById(roomId)
        if (room && room?.status !== ERoomStatus.PLAYING) {
          room.status = ERoomStatus.PLAYING

          const [match] = await Promise.all([
            Match.create({
              roomId,
              playerId1: roomMapItem.playerIdsCanPlay[0],
              playerId2: roomMapItem.playerIdsCanPlay[1],
              maxMove: roomMapItem.maxMove,
              maxTime: roomMapItem.maxTime,
              cooldown: roomMapItem.cooldown,
            }),
            room.save(),
          ])

          // start the game
          roomMapItem.clearTimer()
          roomMapItem.start(match.id)

          io.in(roomId).emit(
            'turn',
            roomMapItem.getNextTurn(),
            roomMapItem.board.state.board,
            roomMapItem.board.getAllMoves(roomMapItem.board.state.board),
          )
          io.in(roomId).emit('play')
          play(io, socket, roomMapItem)
        }
      }
    }, 1000)
    roomMapItem.setTimer(timer)
  })
})

export default start
