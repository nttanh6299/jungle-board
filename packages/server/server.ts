import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { generateId } from './utils'
import { ResGetRoom } from './types'
import Room from './models/Room'

const roomMap: Map<string, Room> = new Map()

const room1 = generateId()
roomMap.set(room1, new Room(room1, 'Official 1'))
const room2 = generateId()
roomMap.set(room2, new Room(room2, 'Official 2'))
const room3 = generateId()
roomMap.set(room3, new Room(room3, 'Official 3'))

const PORT = process.env.PORT || 3001

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors())

app.get('/rooms', (_, res) => {
  const mapToArray: ResGetRoom[] = Array.from(roomMap).map(([, { id, name, maxPlayer, status, players }]) => ({
    id,
    name,
    status,
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
      const { id, name, status, maxPlayer, players } = room
      return res.json({
        id,
        name,
        status,
        max: maxPlayer,
        quantity: players.size,
      })
    }
  }

  return res.json(null)
})

app.post('/create-room', (_, res) => {
  const roomId = generateId()
  roomMap.set(roomId, new Room(roomId, roomId))
  return res.json({ id: roomId, name: roomId })
})

io.on('connection', (socket) => {
  console.log('socket connected')
})

server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
