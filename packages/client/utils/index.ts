import { AllPossibleMoves, BoardDelta, Board } from '@jungle-board/service/lib/gameLogic'
import { ROOM_STATUS } from 'constants/common'
import { isEmpty } from 'utils/lodash/isEmpty'

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
