import httpStatus from 'http-status'
import ApiError from '../utils/ApiError'
import catchAsync from '../utils/catchAsync'
import { generateId } from '../utils'
import roomMap from '../db'
import { ResGetRoom } from '../types'
import Room from '../resolvers/Room'
import { ROOM_STATUS } from '../constants/common'

const toRoom = ({ id, name, status, type, maxPlayer, players }: Room) => ({
  id,
  name,
  status,
  type,
  max: maxPlayer,
  quantity: players.size,
})

const getRooms = catchAsync((req, res) => {
  const mapToArray: ResGetRoom[] = Array.from(roomMap).map(([, room]) => toRoom(room))
  return res.status(httpStatus.OK).send({ data: mapToArray })
})

const getRoom = catchAsync((req, res) => {
  const { roomId } = req.params
  const room = roomMap.get(roomId + '')
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found')
  }
  return res.status(httpStatus.OK).send({ data: toRoom(room) })
})

const createRoom = catchAsync((_, res) => {
  const roomId = generateId()
  const newRoom = new Room(roomId, roomId, ROOM_STATUS.waiting.value, 'custom')
  roomMap.set(roomId, newRoom)
  return res.status(httpStatus.OK).send({ data: toRoom(newRoom) })
})

const roomController = {
  getRooms,
  getRoom,
  createRoom,
}

export default roomController
