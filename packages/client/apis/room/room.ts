import { fetchApi } from 'apis/apiCaller'
import { ResGetRoom } from '@jungle-board/server/lib/types'

export const getRoom = async (roomId: string) => {
  return fetchApi<ResGetRoom>(`/rooms/${roomId}`)
}

export const getRooms = async () => {
  return fetchApi<ResGetRoom[]>(`/rooms`)
}

export const createRoom = async (name: string) => {
  return fetchApi<ResGetRoom>('/rooms', 'POST', { name })
}
