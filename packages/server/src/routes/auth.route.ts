import express from 'express'
import authController from '../controllers/auth.controller'
import { authenticateJwt } from '../middlewares/auth'

const authRoute = express.Router()
authRoute.post('/signIn', authController.signIn)
authRoute.post('/admin', authController.signInAdmin)
authRoute.get('/me', authenticateJwt, authController.getUserStats)

export default authRoute
