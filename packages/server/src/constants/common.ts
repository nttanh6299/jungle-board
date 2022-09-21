import { ERoomStatus } from '../models/room.model'

export const ROOM_STATUS = {
  waiting: {
    label: 'Waiting',
    value: ERoomStatus.WAITING,
  },
  playing: {
    label: 'Playing',
    value: ERoomStatus.PLAYING,
  },
  ending: {
    label: 'Ending',
    value: ERoomStatus.END,
  },
  tie: {
    label: 'Tie',
    value: ERoomStatus.TIE,
  },
}

export const START_COOLDOWN = 5
export const PLAY_COOLDOWN = 20
export const DEFAULT_MAX_MOVE = 50
