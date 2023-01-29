import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync'
import Room, { ERoomStatus } from '../models/room.model'
import RoomResolver from '../resolvers/Room'
import roomMap from '../db'
import { DEFAULT_MAX_MOVE, PLAY_COOLDOWN, ROOM_STATUS, UNABLE_PLAY_REASON } from '../constants/common'
import { ResGetRoom } from '../types'
import { hasUserId, shuffle } from '../utils'
import { IItem } from '../models/item.model'
import { ERROR_TYPE } from '../constants/errorType'

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
  const rooms = await Room.find({ isPrivate: false }).populate<{ theme: IItem }>({ path: 'theme', select: 'name' })
  return res.status(httpStatus.OK).send({
    data: rooms.map(({ id, name, status, type, maxMove, cooldown, theme }) =>
      toRoom({
        id,
        name,
        status,
        type,
        maxMove,
        cooldown,
        theme: theme?.name || '',
        players: roomMap.get(id)?.playerIdsCanPlay?.length || 0,
        maxPlayer: 2,
      }),
    ),
  })
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
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ data: null, status: httpStatus.BAD_REQUEST, type: ERROR_TYPE.createRoomFailed })
  }

  roomMap.set(
    newRoom.id,
    new RoomResolver(newRoom.id, newRoom.maxMove, newRoom.cooldown, !!isPrivate, newRoom.status, newRoom.type),
  )
  return res.status(httpStatus.OK).send({ data: { id: newRoom.id } })
})

const verifyRoom = catchAsync(async (req, res) => {
  const { roomId } = req.body ?? {}
  const room = await Room.findById(roomId).populate<{ theme: IItem }>({ path: 'theme', select: 'name' })
  if (!room) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ data: null, status: httpStatus.BAD_REQUEST, type: ERROR_TYPE.roomNotFound })
  }
  const roomMapItem = roomMap.get(roomId)
  const isWaiting = room.status === ROOM_STATUS.waiting.value
  const canJoin = Number(roomMapItem?.playerIdsCanPlay?.length) < 2
  if (!(isWaiting && canJoin)) {
    return res.status(httpStatus.OK).send({ data: { status: false, reason: UNABLE_PLAY_REASON.roomFull } })
  }

  if (hasUserId(req)) {
    for (const room of roomMap.values()) {
      if (room.players.get(req.userId)) {
        return res.status(httpStatus.OK).send({ data: { status: false, reason: UNABLE_PLAY_REASON.playing } })
      }
    }
  }

  const { id, name, status, type, maxMove, cooldown, theme } = room

  return res.status(httpStatus.OK).send({
    data: {
      status: true,
      info: toRoom({
        id,
        name,
        status,
        type,
        maxMove,
        cooldown,
        theme: theme?.name || '',
        players: roomMap.get(id)?.playerIdsCanPlay?.length,
        maxPlayer: 2,
      }),
    },
  })
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

  return res
    .status(httpStatus.BAD_REQUEST)
    .send({ data: null, status: httpStatus.BAD_REQUEST, type: ERROR_TYPE.joinFailed })
})

const roomController = {
  getRooms,
  createRoom,
  verifyRoom,
  autoJoin,
}

export default roomController
