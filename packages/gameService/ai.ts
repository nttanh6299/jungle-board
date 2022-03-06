import * as gameLogic from './gameLogic'

export interface ThreeTypeMoves {
  lowLevelMoves: gameLogic.BoardDelta[][]
  midLevelMoves: gameLogic.BoardDelta[][]
  highLevelMoves: gameLogic.BoardDelta[][]
}

export function getPossibleMoves(board: gameLogic.Board, computerTurn: string): ThreeTypeMoves {
  const lowLevelMoves: gameLogic.BoardDelta[][] = []
  const midLevelMoves: gameLogic.BoardDelta[][] = []
  const highLevelMoves: gameLogic.BoardDelta[][] = []

  if (!board) {
    return {
      lowLevelMoves,
      midLevelMoves,
      highLevelMoves,
    }
  }

  const opponentTurn = computerTurn === gameLogic.PlayerSymbol.B ? gameLogic.PlayerSymbol.W : gameLogic.PlayerSymbol.B
  for (let row = 0; row < gameLogic.ROWS; row++) {
    for (let col = 0; col < gameLogic.COLS; col++) {
      const piece = board[row][col]

      if (piece === gameLogic.PieceName.L || piece === gameLogic.PieceName.R || piece.charAt(0) !== computerTurn) {
        continue
      }

      const deltaFrom: gameLogic.BoardDelta = { row, col }
      let possibleMoves: gameLogic.BoardDelta[] = []
      switch (piece.substring(1)) {
        case gameLogic.Animal.Elephant:
          possibleMoves = gameLogic.getElephantPossibleMoves(board, computerTurn, deltaFrom)

          if (possibleMoves.length > 0) {
            for (let deltaTo of possibleMoves) {
              const pieceTo = board[deltaTo.row][deltaTo.col]
              const opponentDen = opponentTurn + gameLogic.Structure.Den
              const opponentTrap = opponentTurn + gameLogic.Structure.Trap

              if (pieceTo === gameLogic.PieceName.L || pieceTo === gameLogic.PieceName.R) {
                lowLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentDen) {
                highLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentTrap) {
                midLevelMoves.push([deltaFrom, deltaTo])
              } else {
                midLevelMoves.push([deltaFrom, deltaTo])
              }
            }
          }
          break

        case gameLogic.Animal.Lion:
          possibleMoves = gameLogic.getLionPossibleMoves(board, computerTurn, deltaFrom)

          if (possibleMoves.length > 0) {
            for (let deltaTo of possibleMoves) {
              const pieceTo = board[deltaTo.row][deltaTo.col]
              const opponentDen = opponentTurn + gameLogic.Structure.Den
              const opponentTrap = opponentTurn + gameLogic.Structure.Trap

              if (pieceTo === gameLogic.PieceName.L || pieceTo === gameLogic.PieceName.R) {
                lowLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentDen) {
                highLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentTrap) {
                midLevelMoves.push([deltaFrom, deltaTo])
              } else {
                midLevelMoves.push([deltaFrom, deltaTo])
              }
            }
          }
          break

        case gameLogic.Animal.Tiger:
          possibleMoves = gameLogic.getTigerPossibleMoves(board, computerTurn, deltaFrom)

          if (possibleMoves.length > 0) {
            for (let deltaTo of possibleMoves) {
              const pieceTo = board[deltaTo.row][deltaTo.col]
              const opponentDen = opponentTurn + gameLogic.Structure.Den
              const opponentTrap = opponentTurn + gameLogic.Structure.Trap

              if (pieceTo === gameLogic.PieceName.L || pieceTo === gameLogic.PieceName.R) {
                lowLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentDen) {
                highLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentTrap) {
                midLevelMoves.push([deltaFrom, deltaTo])
              } else {
                midLevelMoves.push([deltaFrom, deltaTo])
              }
            }
          }
          break

        case gameLogic.Animal.Leopard:
          possibleMoves = gameLogic.getLeopardPossibleMoves(board, computerTurn, deltaFrom)

          if (possibleMoves.length > 0) {
            for (let deltaTo of possibleMoves) {
              const pieceTo = board[deltaTo.row][deltaTo.col]
              const opponentDen = opponentTurn + gameLogic.Structure.Den
              const opponentTrap = opponentTurn + gameLogic.Structure.Trap

              if (pieceTo === gameLogic.PieceName.L || pieceTo === gameLogic.PieceName.R) {
                lowLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentDen) {
                highLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentTrap) {
                midLevelMoves.push([deltaFrom, deltaTo])
              } else {
                midLevelMoves.push([deltaFrom, deltaTo])
              }
            }
          }
          break

        case gameLogic.Animal.Dog:
          possibleMoves = gameLogic.getDogPossibleMoves(board, computerTurn, deltaFrom)

          if (possibleMoves.length > 0) {
            for (let deltaTo of possibleMoves) {
              const pieceTo = board[deltaTo.row][deltaTo.col]
              const opponentDen = opponentTurn + gameLogic.Structure.Den
              const opponentTrap = opponentTurn + gameLogic.Structure.Trap

              if (pieceTo === gameLogic.PieceName.L || pieceTo === gameLogic.PieceName.R) {
                lowLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentDen) {
                highLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentTrap) {
                midLevelMoves.push([deltaFrom, deltaTo])
              } else {
                midLevelMoves.push([deltaFrom, deltaTo])
              }
            }
          }
          break

        case gameLogic.Animal.Wolf:
          possibleMoves = gameLogic.getWolfPossibleMoves(board, computerTurn, deltaFrom)

          if (possibleMoves.length > 0) {
            for (let deltaTo of possibleMoves) {
              const pieceTo = board[deltaTo.row][deltaTo.col]
              const opponentDen = opponentTurn + gameLogic.Structure.Den
              const opponentTrap = opponentTurn + gameLogic.Structure.Trap

              if (pieceTo === gameLogic.PieceName.L || pieceTo === gameLogic.PieceName.R) {
                lowLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentDen) {
                highLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentTrap) {
                midLevelMoves.push([deltaFrom, deltaTo])
              } else {
                midLevelMoves.push([deltaFrom, deltaTo])
              }
            }
          }
          break

        case gameLogic.Animal.Cat:
          possibleMoves = gameLogic.getCatPossibleMoves(board, computerTurn, deltaFrom)

          if (possibleMoves.length > 0) {
            for (let deltaTo of possibleMoves) {
              const pieceTo = board[deltaTo.row][deltaTo.col]
              const opponentDen = opponentTurn + gameLogic.Structure.Den
              const opponentTrap = opponentTurn + gameLogic.Structure.Trap

              if (pieceTo === gameLogic.PieceName.L || pieceTo === gameLogic.PieceName.R) {
                lowLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentDen) {
                highLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentTrap) {
                midLevelMoves.push([deltaFrom, deltaTo])
              } else {
                midLevelMoves.push([deltaFrom, deltaTo])
              }
            }
          }
          break

        case gameLogic.Animal.Mouse:
          possibleMoves = gameLogic.getMousePossibleMoves(board, computerTurn, deltaFrom)

          if (possibleMoves.length > 0) {
            for (let deltaTo of possibleMoves) {
              const pieceTo = board[deltaTo.row][deltaTo.col]
              const opponentDen = opponentTurn + gameLogic.Structure.Den
              const opponentTrap = opponentTurn + gameLogic.Structure.Trap

              if (pieceTo === gameLogic.PieceName.L || pieceTo === gameLogic.PieceName.R) {
                lowLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentDen) {
                highLevelMoves.push([deltaFrom, deltaTo])
              } else if (pieceTo === opponentTrap) {
                midLevelMoves.push([deltaFrom, deltaTo])
              } else {
                midLevelMoves.push([deltaFrom, deltaTo])
              }
            }
          }
          break
      }
    }
  }

  return {
    lowLevelMoves,
    midLevelMoves,
    highLevelMoves,
  }
}

export function createComputerMove(board: gameLogic.Board, computerTurn: string): gameLogic.BoardDelta[] {
  const { lowLevelMoves, midLevelMoves, highLevelMoves } = getPossibleMoves(board, computerTurn)
  let returnedIndex = 0

  if (highLevelMoves.length > 0) {
    return highLevelMoves[returnedIndex]
  }

  if (midLevelMoves.length === 1) {
    return midLevelMoves[returnedIndex]
  }

  if (midLevelMoves.length > 1) {
    returnedIndex = Math.floor(Math.random() * midLevelMoves.length)
    return midLevelMoves[returnedIndex]
  }

  returnedIndex = Math.floor(Math.random() * lowLevelMoves.length)
  return lowLevelMoves[returnedIndex]
}
