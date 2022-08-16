import eventHandler from '../utils/eventHandler'
import { GameStatus } from '@jungle-board/service/lib/game'
import roomMap from '../db'
import { PLAY_COOLDOWN } from '../constants/common'
import Match from '../models/match.model'
import Participant, { EUserType } from '../models/participant.model'

const move = eventHandler((io, socket) => {
  socket.on('move', async (moveFrom, moveTo) => {
    const { roomId = '', playerId = '' } = socket.data ?? {}
    const roomMapItem = roomMap.get(roomId)

    if (!roomMapItem) return

    const shouldRotateBoard = playerId !== roomMapItem.getHost()
    roomMapItem.board.move(moveFrom, moveTo, shouldRotateBoard)

    const nextTurn = roomMapItem.getNextTurn()
    const currentBoard = roomMapItem.board.state.board
    const rotatedBoard = roomMapItem.board.getRotatedBoard()
    const playerSelfBoard = shouldRotateBoard ? rotatedBoard : currentBoard
    const otherPlayersBoard = shouldRotateBoard ? currentBoard : rotatedBoard
    const playerSelfPossibleMoves = roomMapItem.board.getAllMoves(playerSelfBoard)
    const otherPlayersPossibleMoves = roomMapItem.board.getAllMoves(otherPlayersBoard)
    socket.emit('turn', nextTurn, playerSelfBoard, playerSelfPossibleMoves)
    socket.to(roomId).emit('turn', nextTurn, otherPlayersBoard, otherPlayersPossibleMoves)

    const play = () => {
      roomMapItem.clearTimer()

      let playCooldown = PLAY_COOLDOWN
      io.in(roomId).emit('playCooldown', playCooldown)
      const timer = setInterval(() => {
        if (playCooldown > 0) {
          playCooldown -= 1
          roomMapItem.incrementPlayTime()
        }

        io.in(roomId).emit('playCooldown', playCooldown)

        if (playCooldown <= 0) {
          roomMapItem.clearTimer()

          const nextTurn = roomMapItem.getNextTurn()

          socket.emit('turn', nextTurn, playerSelfBoard, playerSelfPossibleMoves)
          socket.to(roomId).emit('turn', nextTurn, otherPlayersBoard, otherPlayersPossibleMoves)
          play()
        }
      }, 1000)
      roomMapItem.setTimer(timer)
    }

    const isEnd = roomMapItem.board.gameStatus === GameStatus.END
    const isTie = roomMapItem.board.gameStatus === GameStatus.TIE
    if (isEnd || isTie) {
      // stop everything if the game is ended or tied
      roomMapItem.clearTimer()
      isEnd ? roomMapItem.end() : roomMapItem.tie()

      const match = await Match.findById(roomMapItem.matchId)
      if (match) {
        if (isEnd) {
          match.winnerId = playerId
        } else {
          match.isTie = true
        }
        match.move = roomMapItem.board.moveCount
        match.time = roomMapItem.matchTime
        await match.save()

        const players = Array.from(roomMapItem.players, ([_, player]) => player)
        const participantPromises = players.map(
          async (player) =>
            await Participant.create({
              roomId: roomMapItem.id,
              matchId: roomMapItem.matchId,
              userType: player.playerType,
              isSpectator: player.isSpectator,
              createdAt: new Date(),
              ...(player.playerType === EUserType.IDENTIFIED ? { userId: player.id } : { anonymousUserId: player.id }),
            }),
        )
        await Promise.all(participantPromises)
      }

      io.in(roomId).emit('end', playerId, roomMapItem.status)
    } else if (roomMapItem.board.gameStatus === GameStatus.PLAYING) {
      play()
    }
  })
})

export default move
