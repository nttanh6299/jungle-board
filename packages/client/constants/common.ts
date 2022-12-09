import { ERoomStatus } from './enum'

export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT || ''
export const SOCKET_ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_ENDPOINT || ''

export const ROOM_STATUS = {
  waiting: {
    label: 'Idle',
    value: ERoomStatus.WAITING,
  },
  playing: {
    label: 'InGame',
    value: ERoomStatus.PLAYING,
  },
  ending: {
    label: 'InGame',
    value: ERoomStatus.END,
  },
  tie: {
    label: 'InGame',
    value: ERoomStatus.TIE,
  },
}

export const UNABLE_PLAY_REASON = {
  roomFull: 'ROOM_FULL',
  playing: 'PLAYING',
}
