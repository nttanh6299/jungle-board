import eventHandler from '../utils/eventHandler'
import roomMap from '../db'
import { PLAY_COOLDOWN, START_COOLDOWN } from '../constants/common'
import Room, { ERoomStatus } from '../models/room.model'
import Match from '../models/match.model'

const start = eventHandler((io, socket) => {
  socket.on('start', async () => {
    const { roomId = '' } = socket.data ?? {}
    const roomMapItem = roomMap.get(roomId)!

    if (!roomMapItem) return

    const play = () => {
      roomMapItem.clearTimer()

      let playCooldown = PLAY_COOLDOWN
      io.in(roomId).emit('playCooldown', playCooldown)
      const timer = setInterval(() => {
        if (playCooldown > 0) {
          playCooldown -= 1
          roomMapItem.incrementPlayTime()
        }

        // keep counting down while the player does not any move
        // otherwise we stop running the event there and start counting in move event (see: ./move.event.ts)
        if (roomMapItem.board.moveCount === 0) {
          io.in(roomId).emit('playCooldown', playCooldown)
        }

        // swap turn and keep counting down the timer
        if (playCooldown <= 0) {
          roomMapItem.clearTimer()

          if (roomMapItem.board.moveCount === 0) {
            io.in(roomId).emit(
              'turn',
              roomMapItem.getNextTurn(),
              roomMapItem.board.state.board,
              roomMapItem.board.getAllMoves(roomMapItem.board.state.board),
            )
            play()
          }
        }
      }, 1000)
      roomMapItem.setTimer(timer)
    }

    const bothConnected = roomMapItem.players.size === roomMapItem.maxPlayer
    if (!bothConnected) return

    let cooldown = START_COOLDOWN
    io.in(roomId).emit('readyToPlay', cooldown)
    const timer = setInterval(async () => {
      if (cooldown > 0) {
        cooldown -= 1
      }

      io.in(roomId).emit('readyToPlay', cooldown)

      if (cooldown <= 0) {
        const playerIds = [...roomMapItem.playerIdsCanPlay]
        const match = await Match.create({ roomId, playerId1: playerIds[0], playerId2: playerIds[1] })
        const room = await Room.findById(roomId)

        if (room) {
          room.status = ERoomStatus.PLAYING
          await room.save()
        }

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
        play()
      }
    }, 1000)
    roomMapItem.setTimer(timer)
  })
})

export default start
