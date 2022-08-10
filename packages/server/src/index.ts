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

    start()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

const start = () => {
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
