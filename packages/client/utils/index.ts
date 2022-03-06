import { ROOM_STATUS } from 'server/constants/common'

export const isWaiting = (status: string) => {
  return status === ROOM_STATUS.waiting.value
}

export const canJoin = (quantity: number, max: number, status: string) => {
  return quantity < max && isWaiting(status)
}

export const stringify = (param: string | string[]) => {
  if (!param) return ''
  if (typeof param === 'string') return param
  if (Array.isArray(param)) return param[0] ?? ''
  return ''
}
