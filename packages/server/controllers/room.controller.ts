import httpStatus from 'http-status'
import ApiError from '../utils/ApiError'
import catchAsync from '../utils/catchAsync'
import { generateId } from '../utils'
import roomMap from '../db'
import { ResGetRoom } from '../types'
import Room from '../resolvers/Room'
import { ROOM_STATUS } from '../constants/common'

const getRooms = catchAsync((_, res) => {
  const mapToArray: ResGetRoom[] = Array.from(roomMap).map(([, { id, name, maxPlayer, status, players, type }]) => ({
    id,
    name,
    status,
    type,
    max: maxPlayer,
    quantity: players.size,
  }))
  return res.status(httpStatus.OK).send(mapToArray)
})

const getRoom = catchAsync((req, res) => {
  const { roomId } = req.params
  const room = roomMap.get(roomId + '')

  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found')
  }

  const { id, name, status, maxPlayer, players, type } = room
  return res.status(httpStatus.OK).send({
    id,
    name,
    status,
    type,
    max: maxPlayer,
    quantity: players.size,
  })
})

const createRoom = catchAsync((_, res) => {
  const roomId = generateId()
  roomMap.set(roomId, new Room(roomId, roomId, ROOM_STATUS.waiting.value, 'custom'))
  return res.status(httpStatus.OK).send({ id: roomId, name: roomId })
})

const roomController = {
  getRooms,
  getRoom,
  createRoom,
}

export default roomController
