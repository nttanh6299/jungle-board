import { ERoomStatus } from './enum'

export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || ''

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

export const UNABLE_PLAY_REASON = {
  roomFull: 'ROOM_FULL',
  playing: 'PLAYING',
}
