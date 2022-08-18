import { fetchApi } from 'apis/apiCaller'

export interface ResGetRoom {
  id: string
  name: string
  quantity: number
  max: number
  status: string
  type: string
}

export const getRoom = async (roomId: string) => {
  return fetchApi<ResGetRoom>(`/rooms/${roomId}`)
}

export const getRooms = async () => {
  return fetchApi<ResGetRoom[]>(`/rooms`)
}

export const createRoom = async (name: string) => {
  return fetchApi<ResGetRoom>('/rooms', 'POST', { name })
}
