import axios from 'axios'
import { ResGetRoom } from 'server/types'
import { API_ENDPOINT } from 'constants/common'

export const getRoom = async (roomId: string) => {
  return axios.get<ResGetRoom>(`${API_ENDPOINT}/room/${roomId}`)
}

export const getRooms = async () => {
  return axios.get<ResGetRoom[]>(`${API_ENDPOINT}/rooms`)
}
