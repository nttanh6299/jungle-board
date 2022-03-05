import { ROOM_STATUS } from '../constants/common'
import Player from './Player'

class Room {
  id: string
  name: string
  maxPlayer: number = 2
  status: string
  players: Map<string, Player> = new Map()

  constructor(id: string, name: string, status?: string) {
    this.id = id
    this.name = name
    this.status = status || ROOM_STATUS.waiting.value
  }

  addPlayer(playerId: string, name: string): Player {
    const player = new Player(playerId, name, this.id)
    this.players.set(playerId, player)
    return player
  }
}

export default Room
