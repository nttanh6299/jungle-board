import eventHandler from '../utils/eventHandler'
import { generateId } from '../utils'
import roomMap from '../db'
import Match from '../models/match.model'
import User from '../models/user.model'
import Participant, { EUserType } from '../models/participant.model'
import Room, { ERoomStatus } from '../models/room.model'
import { GameStatus } from 'jungle-board-service'

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

    const shouldRotateBoard = playerId !== roomMapItem.getHost()
    const currentTurn = roomMapItem.getCurrentTurn()
    const currentBoard = roomMapItem.board.state.board
    const rotatedBoard = roomMapItem.board.getRotatedBoard()
    const playerSelfBoard = shouldRotateBoard ? rotatedBoard : currentBoard
    const playerSelfPossibleMoves = roomMapItem.board.getAllMoves(playerSelfBoard)

    socket.emit('reconnectSuccess', currentTurn, playerSelfBoard, playerSelfPossibleMoves)
    console.log(`${roomId} ${playerId}: reconnect`)

    const isEnd = roomMapItem.board.gameStatus === GameStatus.END
    const isTie = roomMapItem.board.gameStatus === GameStatus.TIE

    if (isEnd) {
      roomMapItem.clearTimer()

      const match = await Match.findById(roomMapItem.matchId)
      if (match) {
        match.winnerId = roomMapItem.lastPlayerTurn
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
    } else if (isTie || roomMapItem.isTimeOut()) {
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
              ...(player.playerType === EUserType.IDENTIFIED ? { userId: player.id } : { anonymousUserId: player.id }),
            }),
        )
        Promise.all(participantPromises)
      }

      io.in(roomId).emit('end', roomMapItem.lastPlayerTurn, roomMapItem.status)

      const room = await Room.findById(roomId)
      if (room) {
        room.status = ERoomStatus.WAITING
        await room.save()

        roomMapItem.reset()
      }
    }
  })
})

export default join
