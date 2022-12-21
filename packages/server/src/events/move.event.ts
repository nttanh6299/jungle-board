import eventHandler from '../utils/eventHandler'
import { GameStatus, ROWS, COLS, BoardDelta } from 'jungle-board-service'
import roomMap from '../db'
import Match from '../models/match.model'
import User from '../models/user.model'
import Room, { ERoomStatus } from '../models/room.model'
import Participant, { EUserType } from '../models/participant.model'

const move = eventHandler((io, socket) => {
  socket.on('move', async (moveFrom, moveTo) => {
    const { roomId = '', playerId = '' } = socket.data ?? {}
    const roomMapItem = roomMap.get(roomId)

    if (!roomMapItem) return

    const shouldRotateBoard = playerId !== roomMapItem.getHost()
    roomMapItem.move(moveFrom, moveTo, shouldRotateBoard)

    const rotatedMoveFrom: BoardDelta = { row: ROWS - moveFrom.row - 1, col: COLS - moveFrom.col - 1 }
    const rotatedMoveTo: BoardDelta = { row: ROWS - moveTo.row - 1, col: COLS - moveTo.col - 1 }

    const nextTurn = roomMapItem.getNextTurn()

    const currentBoard = roomMapItem.board.state.board
    const rotatedBoard = roomMapItem.board.getRotatedBoard()

    const playerSelfBoard = shouldRotateBoard ? rotatedBoard : currentBoard
    const otherPlayersBoard = shouldRotateBoard ? currentBoard : rotatedBoard

    const playerSelfPossibleMoves = roomMapItem.board.getAllMoves(playerSelfBoard)
    const otherPlayersPossibleMoves = roomMapItem.board.getAllMoves(otherPlayersBoard)

    console.log('=================== Move')
    console.log('Player id:', playerId)
    console.log('roomMapItem.getHost():', roomMapItem.getHost())
    console.log('shouldRotateBoard:', shouldRotateBoard)
    console.log('nextTurn:', nextTurn)
    console.log('playerSelfBoard:', playerSelfBoard)
    console.log('Move ===================')

    socket.emit('turn', nextTurn, playerSelfBoard, playerSelfPossibleMoves, moveFrom, moveTo)
    socket
      .to(roomId)
      .emit('turn', nextTurn, otherPlayersBoard, otherPlayersPossibleMoves, rotatedMoveFrom, rotatedMoveTo)

    const play = () => {
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

        if (playCooldown >= 0) {
          io.in(roomId).volatile.emit('playCooldown', playCooldown)
        }

        if (playCooldown === 0) {
          playCooldown = -1

          roomMapItem.clearTimer()

          const nextTurn = roomMapItem.getNextTurn()

          console.log('Cooldown ===================')
          console.log('Player id:', playerId)
          console.log('roomMapItem.getHost():', roomMapItem.getHost())
          console.log('shouldRotateBoard:', shouldRotateBoard)
          console.log('nextTurn:', nextTurn)
          console.log('playerSelfBoard:', playerSelfBoard)
          console.log('=================== Cooldown')

          socket.emit('turn', nextTurn, playerSelfBoard, playerSelfPossibleMoves)
          socket.to(roomId).emit('turn', nextTurn, otherPlayersBoard, otherPlayersPossibleMoves)

          if (roomMapItem.status === ERoomStatus.PLAYING) {
            play()
          }
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
          match.winnerId = roomMapItem.lastPlayerTurn
        } else {
          match.isTie = true
        }
        match.move = roomMapItem.board.moveCount
        match.time = roomMapItem.matchTime
        match.save()

        const players = Array.from(roomMapItem.players, ([_, player]) => player)
        const identifiedPlayersPlaying = players.filter(
          (player) => !player.isSpectator && player.playerType === EUserType.IDENTIFIED,
        )
        const userPromises = identifiedPlayersPlaying.map(async (player) => {
          const isWinner = isEnd && player.id === playerId
          return await User.findOneAndUpdate(
            { _id: player.id },
            {
              $inc: {
                xp: isWinner ? 10 : isTie ? 5 : 2,
                win: isWinner ? 1 : 0,
                lose: isWinner ? 0 : isTie ? 0 : 1,
                coin: isWinner ? 3 : isTie ? 2 : 1,
                tie: isTie ? 1 : 0,
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
              ...(player.playerType === EUserType.IDENTIFIED ? { userId: player.id } : { anonymousUserId: player.id }),
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
    } else if (roomMapItem.board.gameStatus === GameStatus.PLAYING) {
      play()
    }
  })
})

export default move
