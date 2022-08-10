import express, { Router } from 'express'
import roomRoute from './room.route'
import authRoute from './auth.route'

interface Route {
  path: string
  route: Router
}

const router = express.Router()

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
