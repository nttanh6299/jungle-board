import express from 'express'
import validate from '../middlewares/validate'
import roomValidation from '../validations/room'
import roomController from '../controllers/room.controller'

const roomRoute = express.Router()
roomRoute.get('/', roomController.getRooms)
roomRoute.get('/:roomId', validate(roomValidation.getRoom), roomController.getRoom)
roomRoute.post('/', roomController.createRoom)
roomRoute.post('/verify', validate(roomValidation.verifyRoom), roomController.verifyRoom)

export default roomRoute
