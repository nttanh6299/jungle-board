import express, { Router } from 'express'
import roomRoute from './room.route'
import authRoute from './auth.route'

interface Route {
  path: string
  route: Router
}

const router = express.Router()

router.get('/health', (_, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date(),
  }

  res.status(200).send({ data })
})

const routes: Route[] = [
  {
    path: '/rooms',
    route: roomRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
]

routes.forEach((route) => {
  router.use(route.path, route.route)
})

export default router
