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

  constructor(id: string, name: string, status?: string, type?: RoomType) {
    this.id = id
    this.name = name
    this.status = status || ROOM_STATUS.waiting.value
    this.type = type || 'reserved'
    this.board = new Game()
  }

  addPlayer(playerId: string, name: string): Player {
    const player = new Player(playerId, name, this.id)
    this.players.set(playerId, player)
    return player
  }

  join(playerId: string): Player | undefined {
    if (this.players.size >= this.maxPlayer) return
    return this.addPlayer(playerId, playerId)
  }

  leave(playerId: string) {
    this.players.delete(playerId)
  }

  reset() {
    this.board.initBoard()
  }
}

export default Room
