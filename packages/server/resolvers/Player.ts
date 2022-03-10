class Player {
  id: string
  name: string
  roomId: string
  isGuest: boolean = true

  constructor(id: string, name: string, roomId: string) {
    this.id = id
    this.name = name
    this.roomId = roomId
  }
}

export default Player
