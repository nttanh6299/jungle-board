export interface IReqCreateRoom {
  name: string
}

export interface ResCreateRoom {
  roomId: string
}

export interface ResGetRoom {
  id: string
  name: string
  quantity: number
  max: number
  status: string
}
