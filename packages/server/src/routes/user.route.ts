import express from 'express'
import userController from '../controllers/user.controller'
import { getUserFromJwt } from '../middlewares/auth'

const userRoute = express.Router()
userRoute.post('/buy', getUserFromJwt, userController.buyTheme)

export default userRoute
