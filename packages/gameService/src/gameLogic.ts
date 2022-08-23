import { dequal } from 'dequal'
import { klona } from 'klona'

export type Board = string[][]

export type AllPossibleMoves = { [key: string]: BoardDelta[] }

export interface BoardDelta {
  row: number
  col: number
}

export interface IState {
  board: Board
  delta?: BoardDelta
}

export const ROWS = 9
export const COLS = 7

export const BlackTraps: BoardDelta[] = [
  { row: 8, col: 2 },
  { row: 7, col: 3 },
  { row: 8, col: 4 },
]
export const WhiteTraps: BoardDelta[] = [
  { row: 0, col: 2 },
  { row: 1, col: 3 },
  { row: 0, col: 4 },
]

export const BlackDen: BoardDelta = { row: 8, col: 3 }
export const WhiteDen: BoardDelta = { row: 0, col: 3 }

export const RiverPos: BoardDelta[] = [
  { row: 3, col: 1 },
  { row: 3, col: 2 },
  { row: 3, col: 4 },
  { row: 3, col: 5 },
  { row: 4, col: 1 },
  { row: 4, col: 2 },
  { row: 4, col: 4 },
  { row: 4, col: 5 },
  { row: 5, col: 1 },
  { row: 5, col: 2 },
  { row: 5, col: 4 },
  { row: 5, col: 5 },
]

export const PlayerSymbol = {
  B: 'B', // player
  W: 'W', // opponent
}

export const Structure = {
  Den: 'Den',
  Trap: 'Trap',
}

export const Animal = {
  Elephant: 'Elephant',
  Lion: 'Lion',
  Tiger: 'Tiger',
  Leopard: 'Leopard',
  Wolf: 'Wolf',
  Dog: 'Dog',
  Cat: 'Cat',
  Rat: 'Rat',
}

export const PieceName = {
  L: 'L',
  R: 'R',

  BDen: 'BDen',
  BTrap: 'BTrap',
  BElephant: 'BElephant',
  BLion: 'BLion',
  BTiger: 'BTiger',
  BLeopard: 'BLeopard',
  BWolf: 'BWolf',
  BDog: 'BDog',
  BCat: 'BCat',
  BRat: 'BRat',

  WDen: 'WDen',
  WTrap: 'WTrap',
  WElephant: 'WElephant',
  WLion: 'WLion',
  WTiger: 'WTiger',
  WLeopard: 'WLeopard',
  WWolf: 'WWolf',
  WDog: 'WDog',
  WCat: 'WCat',
  WRat: 'WRat',
}

const { L, R } = PieceName
const { BDen, BTrap, BElephant, BLion, BTiger, BLeopard, BWolf, BDog, BCat, BRat } = PieceName
const { WDen, WTrap, WElephant, WLion, WTiger, WLeopard, WWolf, WDog, WCat, WRat } = PieceName

export function getEmptyBoard(): Board {
  return [
    [L, L, WTrap, WDen, WTrap, L, L],
    [L, L, L, WTrap, L, L, L],
    [L, L, L, L, L, L, L],
    [L, R, R, L, R, R, L],
    [L, R, R, L, R, R, L],
    [L, R, R, L, R, R, L],
    [L, L, L, L, L, L, L],
    [L, L, L, BTrap, L, L, L],
    [L, L, BTrap, BDen, BTrap, L, L],
  ]
}

export function getInitialBoard(): Board {
  return [
    [WLion, L, WTrap, WDen, WTrap, L, WTiger],
    [L, WDog, L, WTrap, L, WCat, L],
    [WRat, L, WLeopard, L, WWolf, L, WElephant],
    [L, R, R, L, R, R, L],
    [L, R, R, L, R, R, L],
    [L, R, R, L, R, R, L],
    [BElephant, L, BWolf, L, BLeopard, L, BRat],
    [L, BCat, L, BTrap, L, BDog, L],
    [BTiger, L, BTrap, BDen, BTrap, L, BLion],
  ]
}

export function getAnimalLevel(animal: string): number {
  switch (animal) {
    case Animal.Elephant:
      return 7
    case Animal.Lion:
      return 6
    case Animal.Tiger:
      return 5
    case Animal.Leopard:
      return 4
    case Animal.Dog:
      return 3
    case Animal.Wolf:
      return 2
    case Animal.Cat:
      return 1
    case Animal.Rat:
      return 0
    default:
      return -1
  }
}

export function getPieceKind(piece: string): string {
  switch (piece) {
    case PieceName.BElephant:
    case PieceName.WElephant:
      return Animal.Elephant
    case PieceName.BLion:
    case PieceName.WLion:
      return Animal.Lion
    case PieceName.BTiger:
    case PieceName.WTiger:
      return Animal.Tiger
    case PieceName.BLeopard:
    case PieceName.WLeopard:
      return Animal.Leopard
    case PieceName.BWolf:
    case PieceName.WWolf:
      return Animal.Wolf
    case PieceName.BDog:
    case PieceName.WDog:
      return Animal.Dog
    case PieceName.BCat:
    case PieceName.WCat:
      return Animal.Cat
    case PieceName.BRat:
    case PieceName.WRat:
      return Animal.Rat

    default:
      return ''
  }
}

export function getOpponentTurn(playerTurn: string): string {
  return playerTurn === PlayerSymbol.B ? PlayerSymbol.W : playerTurn
}

export function isOutBoard({ row, col }: BoardDelta): boolean {
  return row < 0 || row >= ROWS || col < 0 || col >= COLS
}

export function isInRiver(delta: BoardDelta): boolean {
  return !!RiverPos.find((pos) => dequal(pos, delta))
}

export function isInWTrap(delta: BoardDelta): boolean {
  return !!WhiteTraps.find((pos) => dequal(pos, delta))
}

export function isInBTrap(delta: BoardDelta): boolean {
  return !!BlackTraps.find((pos) => dequal(pos, delta))
}

export function isWDen(delta: BoardDelta): boolean {
  return dequal(WhiteDen, delta)
}

export function isBDen(delta: BoardDelta): boolean {
  return dequal(BlackDen, delta)
}

export function isLand(delta: BoardDelta): boolean {
  return !isInRiver(delta) && !isInWTrap(delta) && !isInBTrap(delta) && !isWDen(delta) && !isBDen(delta)
}

export function isOwnDen(playerTurn: string, delta: BoardDelta): boolean {
  if (playerTurn === PlayerSymbol.B) return dequal(delta, BlackDen)
  if (playerTurn === PlayerSymbol.W) return dequal(delta, WhiteDen)
  return false
}

export function isOpponent(board: Board, delta: BoardDelta): boolean {
  const piece = board[delta.row][delta.col]
  return piece.charAt(0) === PlayerSymbol.W
}

/**
 * Return true if the position has no chess piece
 */
export function noChessPiece(board: Board, delta: BoardDelta): boolean {
  const { L, R, BTrap, WTrap, BDen, WDen } = PieceName
  const piece = board[delta.row][delta.col]
  return [L, R, BTrap, WTrap, BDen, WDen].includes(piece)
}

/**
 * Return true if the position has player's own chess piece
 */
export function isOwnChessPiece(board: Board, playerTurn: string, delta: BoardDelta): boolean {
  if (noChessPiece(board, delta)) return false

  const { row, col } = delta
  const piece = board[row][col]
  const isWhiteChessPiece = playerTurn === PlayerSymbol.W && piece.charAt(0) === PlayerSymbol.W
  const isBlackChessPiece = playerTurn === PlayerSymbol.B && piece.charAt(0) === PlayerSymbol.B
  return isWhiteChessPiece || isBlackChessPiece
}

export function isOwnTrap(playerTurn: string, delta: BoardDelta): boolean {
  if (playerTurn === PlayerSymbol.B) {
    return !!BlackTraps.find((trap) => dequal(trap, delta))
  }

  if (playerTurn === PlayerSymbol.W) {
    return !!WhiteTraps.find((trap) => dequal(trap, delta))
  }

  return false
}

/**
 * Return true if there's a rat in the river when lion or tiger wants to fly through
 */
export function isRatOnWay(board: Board, deltaFrom: BoardDelta, deltaTo: BoardDelta): boolean {
  // horizontal line
  if (deltaFrom.row === deltaTo.row) {
    let riverCol1
    let riverCol2
    // player's chess is being on left side of the river
    if (deltaFrom.col < deltaTo.col) {
      riverCol1 = board[deltaFrom.row][deltaFrom.col + 1]
      riverCol2 = board[deltaFrom.row][deltaFrom.col + 2]
    } else {
      // right side
      riverCol1 = board[deltaFrom.row][deltaFrom.col - 1]
      riverCol2 = board[deltaFrom.row][deltaFrom.col - 2]
    }

    return riverCol1.substring(1) === Animal.Rat || riverCol2.substring(1) === Animal.Rat
  }

  // vertical line
  let riverRow1
  let riverRow2
  let riverRow3
  // player's chess is being on top of the river
  if (deltaFrom.row < deltaTo.row) {
    riverRow1 = board[deltaFrom.row + 1][deltaFrom.col]
    riverRow2 = board[deltaFrom.row + 2][deltaFrom.col]
    riverRow3 = board[deltaFrom.row + 3][deltaFrom.col]
  } else {
    riverRow1 = board[deltaFrom.row - 1][deltaFrom.col]
    riverRow2 = board[deltaFrom.row - 2][deltaFrom.col]
    riverRow3 = board[deltaFrom.row - 3][deltaFrom.col]
  }

  return (
    riverRow1.substring(1) === Animal.Rat ||
    riverRow2.substring(1) === Animal.Rat ||
    riverRow3.substring(1) === Animal.Rat
  )
}

/**
 * Return true if can move (for final compare)
 */
export function canMoveHelper(board: Board, playerTurn: string, deltaFrom: BoardDelta, deltaTo: BoardDelta): boolean {
  // can move if there are no chess pieces on next move
  if (noChessPiece(board, deltaTo)) return true

  // cannot move if there are player's own chess pieces on next move
  if (isOwnChessPiece(board, playerTurn, deltaTo)) return false

  /**
   * there are two cases that player's chess can move
   * 1. opponent's chess is on player's own trap
   * 2. higher animal level can beat lower animal level
   * 3. elephant and rat is special case (rat beats elephant)
   */

  // opponent's chess is on player's own trap
  if (isOwnTrap(playerTurn, deltaTo)) return true

  const playerPiece = board[deltaFrom.row][deltaFrom.col]
  const opponentPiece = board[deltaTo.row][deltaTo.col]

  const playerPieceLevel = getAnimalLevel(playerPiece.substring(1))
  const opponentPieceLevel = getAnimalLevel(opponentPiece.substring(1))
  const elephantLevel = getAnimalLevel(Animal.Elephant)
  const ratLevel = getAnimalLevel(Animal.Rat)

  // higher animal level can beat lower animal level
  if (playerPieceLevel >= opponentPieceLevel) {
    // special case
    if (playerPieceLevel === elephantLevel && opponentPieceLevel === ratLevel) {
      return false
    }
    return true
  } else {
    // playerPieceLevel < opponentPieceLevel
    if (playerPieceLevel === ratLevel && opponentPieceLevel === elephantLevel) {
      return !isInRiver(deltaFrom) // but the rat is in river cannot beat the elephant
    }
    return false
  }
}

export function canLandAnimalMove(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta,
  deltaTo: BoardDelta,
): boolean {
  if (isOutBoard(deltaTo) || isInRiver(deltaTo) || isOwnDen(playerTurn, deltaTo) || dequal(deltaFrom, deltaTo)) {
    return false
  }

  return canMoveHelper(board, playerTurn, deltaFrom, deltaTo)
}

export function canFlyAnimalMove(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta,
  deltaTo: BoardDelta,
): boolean {
  if (isOutBoard(deltaTo) || isInRiver(deltaTo) || isOwnDen(playerTurn, deltaTo) || dequal(deltaFrom, deltaTo)) {
    return false
  }

  return canMoveHelper(board, playerTurn, deltaFrom, deltaTo)
}

export function canSwimAnimalMove(
  board: Board,
  playerTurn: string,
  deltaFrom: BoardDelta,
  deltaTo: BoardDelta,
): boolean {
  if (isOutBoard(deltaTo) || isOwnDen(playerTurn, deltaTo) || dequal(deltaFrom, deltaTo)) {
    return false
  }

  return canMoveHelper(board, playerTurn, deltaFrom, deltaTo)
}

export function getLandAnimalPossibleMoves(board: Board, playerTurn: string, deltaFrom: BoardDelta): BoardDelta[] {
  const possibleMoves: BoardDelta[] = []

  const moveUp: BoardDelta = { row: deltaFrom.row - 1, col: deltaFrom.col }
  if (canLandAnimalMove(board, playerTurn, deltaFrom, moveUp)) {
    possibleMoves.push(moveUp)
  }

  const moveDown: BoardDelta = { row: deltaFrom.row + 1, col: deltaFrom.col }
  if (canLandAnimalMove(board, playerTurn, deltaFrom, moveDown)) {
    possibleMoves.push(moveDown)
  }

  const moveLeft: BoardDelta = { row: deltaFrom.row, col: deltaFrom.col - 1 }
  if (canLandAnimalMove(board, playerTurn, deltaFrom, moveLeft)) {
    possibleMoves.push(moveLeft)
  }

  const moveRight: BoardDelta = { row: deltaFrom.row, col: deltaFrom.col + 1 }
  if (canLandAnimalMove(board, playerTurn, deltaFrom, moveRight)) {
    possibleMoves.push(moveRight)
  }

  return possibleMoves
}

export function getFlyAnimalPossibleMoves(board: Board, playerTurn: string, deltaFrom: BoardDelta): BoardDelta[] {
  const possibleMoves: BoardDelta[] = []

  const moveUp: BoardDelta = { row: deltaFrom.row - 1, col: deltaFrom.col }
  if (isInRiver(moveUp)) {
    // a rat is not on the way, can fly through
    if (!isRatOnWay(board, deltaFrom, moveUp)) {
      moveUp.row = moveUp.row - 3
      if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveUp)) {
        possibleMoves.push(moveUp)
      }
    }
  } else {
    if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveUp)) {
      possibleMoves.push(moveUp)
    }
  }

  const moveDown: BoardDelta = { row: deltaFrom.row + 1, col: deltaFrom.col }
  if (isInRiver(moveDown)) {
    if (!isRatOnWay(board, deltaFrom, moveDown)) {
      moveDown.row = moveDown.row + 3
      if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveDown)) {
        possibleMoves.push(moveDown)
      }
    }
  } else {
    if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveDown)) {
      possibleMoves.push(moveDown)
    }
  }

  const moveLeft: BoardDelta = { row: deltaFrom.row, col: deltaFrom.col - 1 }
  if (isInRiver(moveLeft)) {
    if (!isRatOnWay(board, deltaFrom, moveLeft)) {
      moveLeft.col = moveLeft.col - 2
      if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveLeft)) {
        possibleMoves.push(moveLeft)
      }
    }
  } else {
    if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveLeft)) {
      possibleMoves.push(moveLeft)
    }
  }

  const moveRight: BoardDelta = { row: deltaFrom.row, col: deltaFrom.col + 1 }
  if (isInRiver(moveRight)) {
    if (!isRatOnWay(board, deltaFrom, moveRight)) {
      moveRight.col = moveRight.col + 2
      if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveRight)) {
        possibleMoves.push(moveRight)
      }
    }
  } else {
    if (canFlyAnimalMove(board, playerTurn, deltaFrom, moveRight)) {
      possibleMoves.push(moveRight)
    }
  }

  return possibleMoves
}

export function getSwimPossibleMoves(board: Board, playerTurn: string, deltaFrom: BoardDelta): BoardDelta[] {
  const possibleMoves: BoardDelta[] = []

  const moveUp: BoardDelta = { row: deltaFrom.row - 1, col: deltaFrom.col }
  if (canSwimAnimalMove(board, playerTurn, deltaFrom, moveUp)) {
    possibleMoves.push(moveUp)
  }

  const moveDown: BoardDelta = { row: deltaFrom.row + 1, col: deltaFrom.col }
  if (canSwimAnimalMove(board, playerTurn, deltaFrom, moveDown)) {
    possibleMoves.push(moveDown)
  }

  const moveLeft: BoardDelta = { row: deltaFrom.row, col: deltaFrom.col - 1 }
  if (canSwimAnimalMove(board, playerTurn, deltaFrom, moveLeft)) {
    possibleMoves.push(moveLeft)
  }

  const moveRight: BoardDelta = { row: deltaFrom.row, col: deltaFrom.col + 1 }
  if (canSwimAnimalMove(board, playerTurn, deltaFrom, moveRight)) {
    possibleMoves.push(moveRight)
  }

  return possibleMoves
}

export function getElephantPossibleMoves(board: Board, playerTurn: string, deltaFrom: BoardDelta): BoardDelta[] {
  return getLandAnimalPossibleMoves(board, playerTurn, deltaFrom)
}

export function getLionPossibleMoves(board: Board, playerTurn: string, deltaFrom: BoardDelta): BoardDelta[] {
  return getFlyAnimalPossibleMoves(board, playerTurn, deltaFrom)
}

export function getTigerPossibleMoves(board: Board, playerTurn: string, deltaFrom: BoardDelta): BoardDelta[] {
  return getFlyAnimalPossibleMoves(board, playerTurn, deltaFrom)
}

export function getLeopardPossibleMoves(board: Board, playerTurn: string, deltaFrom: BoardDelta): BoardDelta[] {
  return getLandAnimalPossibleMoves(board, playerTurn, deltaFrom)
}

export function getWolfPossibleMoves(board: Board, playerTurn: string, deltaFrom: BoardDelta): BoardDelta[] {
  return getLandAnimalPossibleMoves(board, playerTurn, deltaFrom)
}

export function getDogPossibleMoves(board: Board, playerTurn: string, deltaFrom: BoardDelta): BoardDelta[] {
  return getLandAnimalPossibleMoves(board, playerTurn, deltaFrom)
}

export function getCatPossibleMoves(board: Board, playerTurn: string, deltaFrom: BoardDelta): BoardDelta[] {
  return getLandAnimalPossibleMoves(board, playerTurn, deltaFrom)
}

export function getRatPossibleMoves(board: Board, playerTurn: string, deltaFrom: BoardDelta): BoardDelta[] {
  return getSwimPossibleMoves(board, playerTurn, deltaFrom)
}

export function getPiecePossibleMoves(board: Board, playerTurn: string, deltaFrom: BoardDelta): BoardDelta[] {
  if (!board) return []

  const piece = board[deltaFrom.row][deltaFrom.col]
  switch (piece.substring(1)) {
    case Animal.Elephant:
      return getElephantPossibleMoves(board, playerTurn, deltaFrom)
    case Animal.Lion:
      return getLionPossibleMoves(board, playerTurn, deltaFrom)
    case Animal.Tiger:
      return getTigerPossibleMoves(board, playerTurn, deltaFrom)
    case Animal.Leopard:
      return getLeopardPossibleMoves(board, playerTurn, deltaFrom)
    case Animal.Wolf:
      return getWolfPossibleMoves(board, playerTurn, deltaFrom)
    case Animal.Dog:
      return getDogPossibleMoves(board, playerTurn, deltaFrom)
    case Animal.Cat:
      return getCatPossibleMoves(board, playerTurn, deltaFrom)
    case Animal.Rat:
      return getRatPossibleMoves(board, playerTurn, deltaFrom)
    default:
      return []
  }
}

export function getWinner(board: Board): string {
  // W win
  if (board[BlackDen.row][BlackDen.col] !== PieceName.BDen) {
    return PlayerSymbol.W
  }

  // B win
  if (board[WhiteDen.row][WhiteDen.col] !== PieceName.WDen) {
    return PlayerSymbol.B
  }

  return ''
}

export function makeMove(board: Board, deltaFrom: BoardDelta, deltaTo: BoardDelta) {
  const prevBoard = klona(board)
  const nextBoard = klona(board)

  const pieceFrom = board[deltaFrom.row][deltaFrom.col]
  const isRiver = isInRiver(deltaFrom)
  const isWTrap = isInWTrap(deltaFrom)
  const isBTrap = isInBTrap(deltaFrom)
  const pieceReplaceFrom = isBTrap ? PieceName.BTrap : isWTrap ? PieceName.WTrap : isRiver ? PieceName.R : PieceName.L

  nextBoard[deltaFrom.row][deltaFrom.col] = pieceReplaceFrom
  nextBoard[deltaTo.row][deltaTo.col] = pieceFrom

  const winner = getWinner(nextBoard)

  return {
    prevBoard,
    nextBoard,
    winner,
  }
}

/**
 * moves: {
 *  BLion: [{ row: 0, col: 1 }, { row: 5, col: 7 }],
 *  BCat: [{ row: 1, col: 1 }, { row: 1, col: 2 }],
 * }
 */
export function getAllMoves(board: Board, playerTurn: string): AllPossibleMoves {
  const allMoves: { [key: string]: BoardDelta[] } = {}

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const piece = board[row][col]

      if (
        piece === PieceName.L ||
        piece === PieceName.R ||
        piece.substring(1) === Structure.Den ||
        piece.substring(1) === Structure.Trap ||
        piece.charAt(0) !== playerTurn
      ) {
        continue
      }

      const deltaFrom = { row, col }
      const possibleMoves = getPiecePossibleMoves(board, playerTurn, deltaFrom)

      if (possibleMoves?.length > 0) {
        allMoves[piece] = possibleMoves
      }
    }
  }

  return allMoves
}
