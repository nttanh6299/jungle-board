import { Board, PlayerSymbol, Structure } from 'jungle-board-service'

const getAnimals = (board: Board, turn: keyof typeof PlayerSymbol) => {
  const flat = board?.flat(Infinity) || []
  const pieces = flat.filter(
    (item) => item?.[0] === turn && !item.includes(Structure.Den) && !item.includes(Structure.Trap),
  )
  return pieces.map((item) => item.slice(1) as string)
}

const getPlayerAnimals = (board) => {
  const playerAnimals = getAnimals(board, 'B')
  const opponentAnimals = getAnimals(board, 'W')
  return {
    playerAnimals,
    opponentAnimals,
  }
}

export default getPlayerAnimals
