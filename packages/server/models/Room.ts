import { Socket } from 'socket.io'
import Player from './Player'

class Room {
  id: string
  players: Map<Socket, Player> = new Map()

  constructor(id: string) {
    this.id = id
  }

  addPlayer(socket: Socket, name: string): Player {
    const player = new Player(this.id, name)
    this.players.set(socket, player)
    return player
  }
}

export default Room
