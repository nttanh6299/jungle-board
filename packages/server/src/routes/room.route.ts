import express from 'express'
import validate from '../middlewares/validate'
import { getUserFromJwt } from '../middlewares/auth'
import roomValidation from '../validations/room'
import roomController from '../controllers/room.controller'

const roomRoute = express.Router()
roomRoute.get('/', roomController.getRooms)
roomRoute.post('/', roomController.createRoom)
roomRoute.post('/verify', getUserFromJwt, validate(roomValidation.verifyRoom), roomController.verifyRoom)
roomRoute.get('/auto-join', roomController.autoJoin)

roomRoute.get('/:roomId', validate(roomValidation.getRoom), roomController.getRoom)

export default roomRoute
