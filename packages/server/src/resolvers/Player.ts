class Player {
  id: string
  roomId: string
  playerType: string
  isSpectator = true

  constructor(id: string, roomId: string, playerType: string) {
    this.id = id
    this.roomId = roomId
    this.playerType = playerType
  }
}

export default Player
