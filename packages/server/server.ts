import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

const PORT = process.env.PORT || 3001

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(cors())

app.get('/data', (req, res) => {
  res.json({ foo: 'bar' })
})

io.on('connection', (socket) => {
  console.log('socket connected')
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
