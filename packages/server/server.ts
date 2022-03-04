import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { generateId } from './utils'
import { IResGetRoom } from './types'
import Room from './models/Room'

const roomMap: Map<string, Room> = new Map()

const PORT = process.env.PORT || 3001

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors())

app.get('/rooms', (_, res) => {
  const mapToArray: IResGetRoom[] = Array.from(roomMap).map(([key]) => ({
    id: key,
  }))
  return res.status(200).json(mapToArray)
})

app.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params

  if (roomId) {
    const room = roomMap.get(roomId + '')

    if (room) {
      // const { players } = room

      // if (players.size === 1) {
      //   const [[_, value]] = players
      //   return res.json({ readyPlayers: room.countPlayers(), opponentName: value.name })
      // }

      // return res.json({ readyPlayers: room.countPlayers() })
      return res.json({ roomId: room.id })
    }
  }

  return res.json(null)
})

app.post('/create-room', (_, res) => {
  const roomId = generateId()
  roomMap.set(roomId, new Room(roomId))
  return res.json({ roomId })
})

io.on('connection', (socket) => {
  console.log('socket connected')
})

server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
