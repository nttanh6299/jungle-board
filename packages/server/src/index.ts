import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import cors from 'cors'
import http from 'http'
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

// set security HTTP headers
app.use(helmet())

// gzip compression
app.use(compression())

// enable cors
app.use(cors())

// route
app.use('/', routes)

server.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`)
})
