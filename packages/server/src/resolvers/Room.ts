import { DEFAULT_MAX_MOVE, PLAY_COOLDOWN, ROOM_STATUS } from '../constants/common'
import Player from './Player'
import { BoardDelta, Game } from 'jungle-board-service'

class Room {
  id: string
  maxPlayer = 2
  status: string
  players: Map<string, Player> = new Map()
  matchId: string
  type: string
  board: Game
  playerTurn = ''
  lastPlayerTurn = ''
  playerIdsCanPlay: string[] = []
  cooldownTimer: NodeJS.Timer | null

  matchTime: number
  maxMove: number
  cooldown: number
  maxTime: number
  isPrivate: boolean

  constructor(id: string, maxMove: number, cooldown: number, isPrivate: boolean, status?: string, type?: string) {
    this.id = id
    this.status = status || ROOM_STATUS.waiting.value
    this.type = type || 'reserved'
    this.cooldownTimer = null
    this.board = new Game()
    this.matchTime = 0
    this.matchId = ''
    this.maxMove = maxMove || DEFAULT_MAX_MOVE
    this.cooldown = cooldown || PLAY_COOLDOWN
    this.maxTime = this.maxMove * this.cooldown
    this.isPrivate = isPrivate
  }

  addPlayer(playerId: string, playerType: string): Player {
    const player = new Player(playerId, this.id, playerType)
    this.players.set(playerId, player)

    if (this.players.size <= 2) {
      this.players.set(playerId, { ...player, isSpectator: false })
      this.playerIdsCanPlay.push(playerId)
    }

    return player
  }

  getNextTurn(): string {
    const nextPlayerTurn = this.playerIdsCanPlay.filter((id) => id !== this.playerTurn)?.[0]
    this.playerTurn = nextPlayerTurn || ''
    return this.playerTurn
  }

  getCurrentTurn(): string {
    return this.playerTurn
  }

  move(moveFrom: BoardDelta, moveTo: BoardDelta, shouldRotateBoard: boolean): boolean {
    const moved = this.board.move(moveFrom, moveTo, shouldRotateBoard)
    if (moved) {
      this.lastPlayerTurn = this.playerTurn
    }
    return moved
  }

  getFirstPlayer(): string {
    return this.playerIdsCanPlay[0]
  }

  getHost(): string {
    // the host will be first player join in the room
    return this.getFirstPlayer()
  }

  leave(playerId: string) {
    this.playerIdsCanPlay = this.playerIdsCanPlay.filter((id) => id !== playerId)
    this.players.delete(playerId)
  }

  reset() {
    this.status = ROOM_STATUS.waiting.value
    this.playerTurn = ''
    this.matchId = ''
    this.matchTime = 0
    this.board.initBoard()
  }

  start(matchId: string) {
    this.status = ROOM_STATUS.playing.value
    this.board.startGame(this.maxMove)
    this.matchId = matchId
    this.matchTime = 0
  }

  end() {
    this.status = ROOM_STATUS.ending.value
  }

  tie() {
    this.status = ROOM_STATUS.tie.value
  }

  setTimer(timer: NodeJS.Timer) {
    this.cooldownTimer = timer
  }

  clearTimer() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer)
    }
  }

  incrementPlayTime() {
    this.matchTime += 1
  }

  isTimeOut() {
    return this.matchTime === this.maxTime
  }
}

export default Room
