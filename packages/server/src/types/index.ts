export interface ReqCreateRoom {
  name: string
}

export interface ResCreateRoom {
  roomId: string
}

export interface ResGetRoom {
  id: string
  name: string
  status: string
  type: string
  cooldown: number
  maxMove: number
  max: number
  quantity: number
  theme: string
}
