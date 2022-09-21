import httpStatus from 'http-status'
import ApiError from '../utils/ApiError'
import catchAsync from '../utils/catchAsync'
import Room from '../models/room.model'
import RoomResolver from '../resolvers/Room'
import roomMap from '../db'
import { DEFAULT_MAX_MOVE, PLAY_COOLDOWN } from '../constants/common'

const toRoom = ({ id, name, status, type, maxPlayer, players, cooldown, maxMove }) => ({
  id,
  name,
  status,
  type,
  cooldown,
  maxMove,
  max: maxPlayer,
  quantity: players,
})

const getRooms = catchAsync(async (_, res) => {
  const rooms = await Room.find()
  return res.status(httpStatus.OK).send({
    data: rooms.map(({ id, name, status, type, maxMove, cooldown }) =>
      toRoom({
        id,
        name,
        status,
        type,
        maxMove,
        cooldown,
        players: roomMap.get(id)?.playerIdsCanPlay?.length,
        maxPlayer: 2,
      }),
    ),
  })
})

const getRoom = catchAsync(async (req, res) => {
  const { roomId } = req.params
  const room = await Room.findById(roomId)
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found')
  }

  const { id, name, status, type, maxMove, cooldown } = room
  const roomMapItem = roomMap.get(id)
  const roomRes = toRoom({
    id,
    name,
    status,
    type,
    maxMove,
    cooldown,
    players: roomMapItem?.playerIdsCanPlay?.length,
    maxPlayer: 2,
  })
  return res.status(httpStatus.OK).send({ data: roomRes })
})

const createRoom = catchAsync(async (req, res) => {
  const { name, maxMove, cooldown } = req.body ?? {}
  const newRoom = await Room.create({
    name: name || 'Unnamed',
    maxMove: maxMove || DEFAULT_MAX_MOVE,
    cooldown: cooldown || PLAY_COOLDOWN,
    type: 'custom',
  })
  if (!newRoom) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot create room')
  }

  roomMap.set(newRoom.id, new RoomResolver(newRoom.id, newRoom.maxMove, newRoom.cooldown, newRoom.status, newRoom.type))
  return res.status(httpStatus.OK).send({ data: { id: newRoom.id } })
})

const roomController = {
  getRooms,
  getRoom,
  createRoom,
}

export default roomController
