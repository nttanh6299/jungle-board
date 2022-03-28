import eventHandler from '../utils/eventHandler'
import { GameStatus } from '@jungle-board/service/lib/game'
import roomMap from '../db'
import { PLAY_COOLDOWN } from '../constants/common'

const move = eventHandler((io, socket) => {
  socket.on('move', (moveFrom, moveTo) => {
    const { roomId = '', playerId = '' } = socket.data ?? {}
    const room = roomMap.get(roomId)

    if (!room) return

    const shouldRotateBoard = playerId !== room.getHost()
    room.board.move(moveFrom, moveTo, shouldRotateBoard)

    const nextTurn = room.getNextTurn()
    const currentBoard = room.board.state.board
    const rotatedBoard = room.board.getRotatedBoard()
    const playerSelfBoard = shouldRotateBoard ? rotatedBoard : currentBoard
    const otherPlayersBoard = shouldRotateBoard ? currentBoard : rotatedBoard
    const playerSelfPossibleMoves = room.board.getAllMoves(playerSelfBoard)
    const otherPlayersPossibleMoves = room.board.getAllMoves(otherPlayersBoard)
    socket.emit('turn', nextTurn, playerSelfBoard, playerSelfPossibleMoves)
    socket.to(roomId).emit('turn', nextTurn, otherPlayersBoard, otherPlayersPossibleMoves)

    const play = () => {
      room.clearTimer()

      let playCooldown = PLAY_COOLDOWN
      io.in(roomId).emit('playCooldown', playCooldown)
      const timer = setInterval(() => {
        if (playCooldown > 0) {
          playCooldown -= 1
        }

        io.in(roomId).emit('playCooldown', playCooldown)

        if (playCooldown <= 0) {
          room.clearTimer()

          const nextTurn = room.getNextTurn()

          socket.emit('turn', nextTurn, playerSelfBoard, playerSelfPossibleMoves)
          socket.to(roomId).emit('turn', nextTurn, otherPlayersBoard, otherPlayersPossibleMoves)
          play()
        }
      }, 1000)
      room.setTimer(timer)
    }

    if (room.board.gameStatus === GameStatus.END || room.board.gameStatus === GameStatus.TIE) {
      // stop everything if the game is ended or tied
      room.clearTimer()
      room.board.gameStatus === GameStatus.END ? room.end() : room.tie()
      io.in(roomId).emit('end', playerId, room.status)
    } else if (room.board.gameStatus === GameStatus.PLAYING) {
      play()
    }
  })
})

export default move
