import { AllPossibleMoves, BoardDelta, Board } from 'jungle-board-service'
import { ROOM_STATUS } from 'constants/common'
import { isEmpty } from 'utils/lodash/isEmpty'
import { eraseCookie, getCookie, setCookie } from './cookie'
import { COOKIE_NAME } from 'constants/auth'

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

export const getPossibleMoves = (board: Board, moves: AllPossibleMoves, row: number, col: number): BoardDelta[] => {
  if (row >= 0 && col >= 0) {
    const piece = board[row][col]
    if (!isEmpty(moves) && moves[piece]) {
      return moves[piece]
    }
  }
  return []
}

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return getCookie(COOKIE_NAME)
  }
  return null
}

export const setAccessToken = (token: string) => {
  if (typeof window !== 'undefined') {
    setCookie(COOKIE_NAME, token, 365)
  }
}

export const clearAccessToken = () => {
  if (typeof window !== 'undefined') {
    eraseCookie(COOKIE_NAME)
  }
}
