import * as gameLogic from './gameLogic'
import * as ai from './ai'
import { klona } from 'klona'

export enum GameStatus {
  READY = 'Ready',
  PLAYING = 'Playing',
  PAUSE = 'Pause',
  END = 'End',
  TIE = 'Tie',
}

type History = {
  moves: gameLogic.Board[]
}

class Game {
  state: gameLogic.IState = { board: [] }
  playerTurn: string = ''
  moveCount: number = 0

  gameStatus: GameStatus = GameStatus.READY
  isSinglePlay: boolean = false

  history: History = { moves: [] }

  constructor() {
    this.initBoard()
  }

  initBoard() {
    this.state.board = gameLogic.getEmptyBoard()
  }

  startGame(isSinglePlay?: boolean): void {
    this.gameStatus = GameStatus.PLAYING
    this.state.board = gameLogic.getInitialBoard()
    this.playerTurn = gameLogic.PlayerSymbol.B
    this.isSinglePlay = Boolean(isSinglePlay)
    this.moveCount = 0
  }

  getWinner(): string {
    return gameLogic.getWinner(this.state.board)
  }

  getAllMoves(board: gameLogic.Board): gameLogic.AllPossibleMoves {
    return gameLogic.getAllMoves(board, this.playerTurn)
  }

  getRotatedBoard(): gameLogic.Board {
    const rotatedBoard = klona(this.state.board).reverse()
    for (let row = 0; row < gameLogic.ROWS; row++) {
      for (let col = 0; col < gameLogic.COLS / 2; col++) {
        const oppositeCol = gameLogic.COLS - col - 1
        const piece = rotatedBoard[row][col]
        const oppositePiece = rotatedBoard[row][oppositeCol]

        if (piece.includes(gameLogic.PlayerSymbol.B)) {
          rotatedBoard[row][col] = gameLogic.PlayerSymbol.W + piece.substring(1)
        } else if (piece.includes(gameLogic.PlayerSymbol.W)) {
          rotatedBoard[row][col] = gameLogic.PlayerSymbol.B + piece.substring(1)
        }

        if (oppositePiece.includes(gameLogic.PlayerSymbol.B)) {
          rotatedBoard[row][oppositeCol] = gameLogic.PlayerSymbol.W + oppositePiece.substring(1)
        } else if (oppositePiece.includes(gameLogic.PlayerSymbol.W)) {
          rotatedBoard[row][oppositeCol] = gameLogic.PlayerSymbol.B + oppositePiece.substring(1)
        }

        const temp = rotatedBoard[row][col]
        rotatedBoard[row][col] = rotatedBoard[row][oppositeCol]
        rotatedBoard[row][oppositeCol] = temp
      }
    }
    return rotatedBoard
  }

  move(
    deltaFrom: gameLogic.BoardDelta,
    deltaTo: gameLogic.BoardDelta,
    shouldRotateBoard?: boolean,
  ): void {
    if (this.state.board) {
      if (shouldRotateBoard) {
        deltaFrom.row = gameLogic.ROWS - deltaFrom.row - 1
        deltaFrom.col = gameLogic.COLS - deltaFrom.col - 1
        deltaTo.row = gameLogic.ROWS - deltaTo.row - 1
        deltaTo.col = gameLogic.COLS - deltaTo.col - 1
      }

      const { prevBoard, nextBoard, winner } = gameLogic.makeMove(this.state.board, deltaFrom, deltaTo)

      this.history.moves.push(prevBoard)
      this.state.board = nextBoard
      this.moveCount += 1

      if (winner !== '') {
        if (winner === this.playerTurn || winner === gameLogic.getOpponentTurn(this.playerTurn)) {
          this.gameStatus = GameStatus.END
        } else {
          this.gameStatus = GameStatus.TIE
        }
        return
      }
    }
  }

  computerMove(setCanMakeMove?: (canMove: boolean) => void): void {
    setTimeout(() => {
      if (this.state.board) {
        const [deltaFrom, deltaTo] = ai.createComputerMove(this.state.board, gameLogic.PlayerSymbol.W)
        const { prevBoard, nextBoard, winner } = gameLogic.makeMove(this.state.board, deltaFrom, deltaTo)

        this.history.moves.push(prevBoard)
        this.state.board = nextBoard

        if (winner !== '') {
          if (winner === this.playerTurn || winner === gameLogic.getOpponentTurn(this.playerTurn)) {
            this.gameStatus = GameStatus.END
          } else {
            this.gameStatus = GameStatus.TIE
          }
          return
        }

        setCanMakeMove && setCanMakeMove(true)
      }
    }, 1000)
  }
}

export default Game
