import httpStatus from 'http-status'
import ApiError from '../utils/ApiError'
import catchAsync from '../utils/catchAsync'
import Room, { ERoomStatus } from '../models/room.model'
import RoomResolver from '../resolvers/Room'
import roomMap from '../db'
import { DEFAULT_MAX_MOVE, PLAY_COOLDOWN, ROOM_STATUS, UNABLE_PLAY_REASON } from '../constants/common'
import { ResGetRoom } from '../types'
import { shuffle } from '../utils'

const toRoom = ({ id, name, status, type, maxPlayer, players, cooldown, maxMove, theme }): ResGetRoom => ({
  id,
  name,
  status,
  type,
  cooldown,
  maxMove,
  theme,
  max: maxPlayer,
  quantity: players,
})

const getRooms = catchAsync(async (_, res) => {
  const rooms = await Room.find({ isPrivate: false })
  return res.status(httpStatus.OK).send({
    data: rooms.map(({ id, name, status, type, maxMove, cooldown, theme }) =>
      toRoom({
        id,
        name,
        status,
        type,
        maxMove,
        cooldown,
        theme,
        players: roomMap.get(id)?.playerIdsCanPlay?.length || 0,
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

  const { id, name, status, type, maxMove, cooldown, theme } = room
  const roomMapItem = roomMap.get(id)
  const roomRes = toRoom({
    id,
    name,
    status,
    type,
    maxMove,
    cooldown,
    theme,
    players: roomMapItem?.playerIdsCanPlay?.length,
    maxPlayer: 2,
  })
  return res.status(httpStatus.OK).send({ data: roomRes })
})

const createRoom = catchAsync(async (req, res) => {
  const { name, maxMove, cooldown, theme, isPrivate } = req.body ?? {}
  const newRoom = await Room.create({
    name: name || 'Unnamed',
    cooldown: cooldown || PLAY_COOLDOWN,
    maxMove: maxMove || DEFAULT_MAX_MOVE,
    theme: theme || 'rainforest',
    isPrivate: !!isPrivate,
    type: 'custom',
  })
  if (!newRoom) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot create room')
  }

  roomMap.set(
    newRoom.id,
    new RoomResolver(newRoom.id, newRoom.maxMove, newRoom.cooldown, !!isPrivate, newRoom.status, newRoom.type),
  )
  return res.status(httpStatus.OK).send({ data: { id: newRoom.id } })
})

const verifyRoom = catchAsync(async (req, res) => {
  const { roomId, accountId } = req.body ?? {}
  const room = await Room.findById(roomId)
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found')
  }
  const roomMapItem = roomMap.get(roomId)
  const isWaiting = room.status === ROOM_STATUS.waiting.value
  const canJoin = Number(roomMapItem?.playerIdsCanPlay?.length) < 2
  if (!(isWaiting && canJoin)) {
    return res.status(httpStatus.OK).send({ data: { status: false, reason: UNABLE_PLAY_REASON.roomFull } })
  }

  if (accountId) {
    for (const room of roomMap.values()) {
      if (room.players.get(accountId)) {
        return res.status(httpStatus.OK).send({ data: { status: false, reason: UNABLE_PLAY_REASON.playing } })
      }
    }
  }

  return res.status(httpStatus.OK).send({ data: { status: true } })
})

const autoJoin = catchAsync(async (req, res) => {
  const mapToArray = [...roomMap].map(([_, room]) => room)
  const shuffleArray = shuffle(mapToArray)

  for (const room of shuffleArray) {
    if (room.playerIdsCanPlay.length === 1 && room.status === ERoomStatus.WAITING && !room.isPrivate) {
      return res.status(httpStatus.OK).send({ data: { roomId: room.id } })
    }
  }

  for (const room of shuffleArray) {
    if (room.status === ERoomStatus.WAITING && !room.isPrivate) {
      return res.status(httpStatus.OK).send({ data: { roomId: room.id } })
    }
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot join automatically')
})

const roomController = {
  getRooms,
  getRoom,
  createRoom,
  verifyRoom,
  autoJoin,
}

export default roomController
