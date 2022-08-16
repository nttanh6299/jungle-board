import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import http from 'http'
import mongoose from 'mongoose'
import config from './config/config'
import morgan from './config/morgan'
import routes from './routes'
import io from './events'
import roomMap from './db'
import Room from './models/room.model'
import RoomResolver from './resolvers/Room'

const app = express()
const server = http.createServer(app)
io(server)

if (config.env !== 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}

const connectApp = async () => {
  try {
    await mongoose.connect(config.mongoose.url)

    const rooms = await Room.find({ isActive: true })
    rooms.forEach((room) => {
      roomMap.set(room.id, new RoomResolver(room.id, room.status, room.type))
    })

    startServer()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

const startServer = () => {
  server.listen(config.port, () => {
    console.log(`App started on port ${config.port}`)
  })
}

// set security HTTP headers
app.use(helmet())

// parse json request body
app.use(express.json())

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }))

// gzip compression
app.use(compression())

// enable cors
app.use(cors())

// route
app.use('/', routes)

connectApp()
