import eventHandler from '../utils/eventHandler'
import roomMap from '../db'
import { PLAY_COOLDOWN, START_COOLDOWN } from '../constants/common'

const start = eventHandler((io, socket) => {
  socket.on('start', () => {
    const { roomId = '' } = socket.data ?? {}
    const room = roomMap.get(roomId)

    if (!room) return

    const play = () => {
      room.clearTimer()

      let playCooldown = PLAY_COOLDOWN
      io.in(room.id).emit('playCooldown', playCooldown)
      const timer = setInterval(() => {
        if (playCooldown > 0) {
          playCooldown -= 1
        }

        // keep counting down while the player does not any move
        // otherwise we stop running the event there and start counting in move event (see: ./move.event.ts)
        if (room.board.moveCount === 0) {
          io.in(room.id).emit('playCooldown', playCooldown)
        }

        // swap turn and keep counting down the timer
        if (playCooldown <= 0) {
          room.clearTimer()

          if (room.board.moveCount === 0) {
            io.in(room.id).emit(
              'turn',
              room.getNextTurn(),
              room.board.state.board,
              room.board.getAllMoves(room.board.state.board),
            )
            play()
          }
        }
      }, 1000)
      room.setTimer(timer)
    }

    const bothConnected = room.players.size === room.maxPlayer
    if (bothConnected) {
      let cooldown = START_COOLDOWN
      io.in(roomId).emit('readyToPlay', cooldown)
      const timer = setInterval(() => {
        if (cooldown > 0) {
          cooldown -= 1
        }

        io.in(roomId).emit('readyToPlay', cooldown)

        if (cooldown <= 0) {
          // start the game
          room.clearTimer()
          room.start()
          io.in(roomId).emit(
            'turn',
            room.getNextTurn(),
            room.board.state.board,
            room.board.getAllMoves(room.board.state.board),
          )

          play()
        }
      }, 1000)
      room.setTimer(timer)
    }
  })
})

export default start
