import { ROOM_STATUS } from 'server/constants/common'

export const isWaiting = (status: string) => {
  return status === ROOM_STATUS.waiting.value
}

export const canJoin = (quantity: number, max: number, status: string) => {
  return quantity < max && isWaiting(status)
}
