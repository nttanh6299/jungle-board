import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { generateId } from './utils'
import { ResGetRoom } from './types'
import Room from './resolvers/Room'
import { ROOM_STATUS } from './constants/common'
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './types/socket'
import { GameStatus } from '../gameService/game'

const roomMap: Map<string, Room> = new Map()

const room1 = '1'
roomMap.set(room1, new Room(room1, 'Official 1'))
const room2 = '2'
roomMap.set(room2, new Room(room2, 'Official 2'))
const room3 = '3'
roomMap.set(room3, new Room(room3, 'Official 3'))

const PORT = process.env.PORT || 3001

const app = express()
const server = http.createServer(app)
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server)

app.use(cors())

app.get('/rooms', (_, res) => {
  const mapToArray: ResGetRoom[] = Array.from(roomMap).map(([, { id, name, maxPlayer, status, players, type }]) => ({
    id,
    name,
    status,
    type,
    max: maxPlayer,
    quantity: players.size,
  }))
  return res.status(200).json(mapToArray)
})

app.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params

  if (roomId) {
    const room = roomMap.get(roomId + '')

    if (room) {
      const { id, name, status, maxPlayer, players, type } = room
      return res.json({
        id,
        name,
        status,
        type,
        max: maxPlayer,
        quantity: players.size,
      })
    }
  }

  return res.json(null)
})

app.post('/create-room', (_, res) => {
  const roomId = generateId()
  roomMap.set(roomId, new Room(roomId, roomId, ROOM_STATUS.waiting.value, 'custom'))
  return res.json({ id: roomId, name: roomId })
})

io.on('connection', (socket) => {
  socket.on('join', (roomId) => {
    const room = roomMap.get(roomId)

    if (!room) return

    const playerId = `p-${generateId()}`
    const player = room.join(playerId)
    const bothConnected = room.players.size === room.maxPlayer
    if (player) {
      socket.join(room.id)
      socket.data = {
        ...socket.data,
        roomId: room.id,
        playerId: playerId,
      }

      // send playerId to the joined player
      socket.emit('playerJoin', playerId, room.playerIdsCanPlay.length === 1)

      // to all clients in roomId
      io.in(roomId).emit('checkRoom', room.board.state.board, bothConnected)
    }
  })

  socket.on('start', () => {
    const { roomId = '' } = socket.data ?? {}
    const room = roomMap.get(roomId)
    if (room) {
      const bothConnected = room.players.size === room.maxPlayer
      if (bothConnected) {
        let cooldown = 5
        io.in(roomId).emit('readyToPlay', cooldown)
        room.cooldownTimer = setInterval(() => {
          if (cooldown > 0) {
            cooldown -= 1
          }

          io.in(roomId).emit('readyToPlay', cooldown)

          if (cooldown <= 0) {
            if (room.cooldownTimer) {
              clearInterval(room.cooldownTimer)
            }

            room.start()
            io.in(roomId).emit(
              'turn',
              room.getNextTurn(),
              room.board.state.board,
              room.board.getAllMoves(room.board.state.board),
            )

            const play = () => {
              if (room.cooldownTimer) {
                clearInterval(room.cooldownTimer)
              }

              let playCooldown = 20
              io.in(roomId).emit('playCooldown', playCooldown)
              room.cooldownTimer = setInterval(() => {
                if (playCooldown > 0) {
                  playCooldown -= 1
                }

                if (room.board.moveCount === 0) {
                  io.in(roomId).emit('playCooldown', playCooldown)
                }

                if (playCooldown <= 0) {
                  if (room.cooldownTimer) {
                    clearInterval(room.cooldownTimer)
                  }
                  if (room.board.moveCount === 0) {
                    io.in(roomId).emit(
                      'turn',
                      room.getNextTurn(),
                      room.board.state.board,
                      room.board.getAllMoves(room.board.state.board),
                    )
                    play()
                  }
                }
              }, 1000)
            }

            play()
          }
        }, 1000)
      }
    }
  })

  socket.on('move', (moveFrom, moveTo) => {
    const { roomId = '', playerId = '' } = socket.data ?? {}
    const room = roomMap.get(roomId)
    if (room) {
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
      if (room.cooldownTimer) {
        clearInterval(room.cooldownTimer)
      }

      const play = () => {
        if (room.cooldownTimer) {
          clearInterval(room.cooldownTimer)
        }

        let playCooldown = 20
        io.in(roomId).emit('playCooldown', playCooldown)
        room.cooldownTimer = setInterval(() => {
          if (playCooldown > 0) {
            playCooldown -= 1
          }

          io.in(roomId).emit('playCooldown', playCooldown)

          if (playCooldown <= 0) {
            if (room.cooldownTimer) {
              clearInterval(room.cooldownTimer)
            }

            const nextTurn = room.getNextTurn()

            socket.emit('turn', nextTurn, playerSelfBoard, playerSelfPossibleMoves)
            socket.to(roomId).emit('turn', nextTurn, otherPlayersBoard, otherPlayersPossibleMoves)
            play()
          }
        }, 1000)
      }

      if (room.board.gameStatus === GameStatus.END || room.board.gameStatus === GameStatus.TIE) {
        if (room.cooldownTimer) {
          clearInterval(room.cooldownTimer)
        }
        room.board.gameStatus === GameStatus.END ? room.end() : room.tie()
        io.in(roomId).emit('end', playerId, room.status)
      } else if (room.board.gameStatus === GameStatus.PLAYING) {
        play()
      }
    }
  })

  // a player disconnect
  socket.on('disconnect', () => {
    const { roomId = '', playerId = '' } = socket.data ?? {}
    const room = roomMap.get(roomId)
    if (room) {
      // emit to another player that we leave the room
      socket.to(roomId).emit('playerDisconnect', !room.players.get(playerId)?.isGuest)
      socket.leave(roomId)
      room.leave(playerId)
      room.reset()
      if (room.cooldownTimer) {
        clearInterval(room.cooldownTimer)
      }

      if (room.players.size === 0 && room.type === 'custom') {
        roomMap.delete(roomId)
      }
    }
  })
})

server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
