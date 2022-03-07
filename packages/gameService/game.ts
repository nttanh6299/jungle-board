import * as gameLogic from './gameLogic'
import * as ai from './ai'

export enum GameStatus {
  READY = 'Ready',
  PLAYING = 'Playing',
  PAUSE = 'Pause',
  WIN = 'Win',
  LOSE = 'Lose',
  TIE = 'Tie',
}

type History = {
  moves: gameLogic.Board[]
}

class Game {
  state: gameLogic.IState = { board: [] }
  playerTurn: string = ''

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
  }

  canSelect(row: number, col: number): boolean {
    if (this.gameStatus !== GameStatus.PLAYING) return false

    const piece = this.state.board[row][col]

    if (
      this.playerTurn === piece.charAt(0) &&
      piece.substring(1) !== gameLogic.Structure.Den &&
      piece.substring(1) !== gameLogic.Structure.Trap
    ) {
      const deltaFrom = { row, col }
      const possibleMoves = gameLogic.getPiecePossibleMoves(this.state.board, this.playerTurn, deltaFrom)
      return possibleMoves.length > 0
    }

    return false
  }

  getWinner(): string {
    return gameLogic.getWinner(this.state.board)
  }

  getMoves(row: number, col: number): gameLogic.BoardDelta[] {
    if (!this.canSelect(row, col)) return []

    const deltaFrom = { row, col }
    const possibleMoves = gameLogic.getPiecePossibleMoves(this.state.board, this.playerTurn, deltaFrom)
    return possibleMoves
  }

  getAllMoves(): gameLogic.AllPossibleMoves {
    return gameLogic.getAllMoves(this.state.board, this.playerTurn)
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

      if (winner !== '') {
        if (winner === this.playerTurn) {
          this.gameStatus = GameStatus.WIN
        } else if (winner === gameLogic.getOpponentTurn(this.playerTurn)) {
          this.gameStatus = GameStatus.LOSE
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
          if (winner === this.playerTurn) {
            this.gameStatus = GameStatus.WIN
          } else if (winner === gameLogic.getOpponentTurn(this.playerTurn)) {
            this.gameStatus = GameStatus.LOSE
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
