import { ROOM_STATUS } from '../constants/common'
import Player from './Player'
import Game from '../../gameService/game'

type RoomType = 'reserved' | 'custom'

class Room {
  id: string
  name: string
  maxPlayer: number = 2
  status: string
  players: Map<string, Player> = new Map()
  type: RoomType
  board: Game
  playerTurn: string = ''
  playerIdsCanPlay: string[] = []
  cooldownTimer: NodeJS.Timer | null

  constructor(id: string, name: string, status?: string, type?: RoomType) {
    this.id = id
    this.name = name
    this.status = status || ROOM_STATUS.waiting.value
    this.type = type || 'reserved'
    this.cooldownTimer = null
    this.board = new Game()
  }

  addPlayer(playerId: string, name: string): Player {
    const player = new Player(playerId, name, this.id)
    this.players.set(playerId, player)

    if (this.players.size <= 2) {
      this.playerIdsCanPlay.push(playerId)
    }

    return player
  }

  getNextTurn(): string {
    const currentTurnIndex = this.playerIdsCanPlay.findIndex(id => id === this.playerTurn)
    this.playerTurn = this.playerIdsCanPlay[(currentTurnIndex + 1) % 2]
    return this.playerTurn
  }

  getHost(): string {
    // the host will be first player join in the room
    return this.playerIdsCanPlay[0]
  }

  join(playerId: string): Player | undefined {
    if (this.players.size >= this.maxPlayer) return
    return this.addPlayer(playerId, playerId)
  }

  leave(playerId: string) {
    this.playerIdsCanPlay = this.playerIdsCanPlay.filter(id => id !== playerId)
    this.players.delete(playerId)
  }

  reset() {
    this.board.initBoard()
  }

  start() {
    this.status = ROOM_STATUS.playing.value
    this.board.startGame()
  }

  end() {
    this.status = ROOM_STATUS.ending.value
  }

  tie() {
    this.status = ROOM_STATUS.tie.value
  }
}

export default Room
