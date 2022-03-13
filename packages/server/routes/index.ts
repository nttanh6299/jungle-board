import express, { Router } from 'express'
import roomRoute from './room.route'

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
]

routes.forEach((route) => {
  router.use(route.path, route.route)
})

export default router
