import { fetchApi } from 'apis/apiCaller'

export interface ReqCreateRoom {
  name: string
  maxMove: number
  cooldown: number
}

export interface ResGetRoom {
  id: string
  name: string
  quantity: number
  max: number
  status: string
  type: string
  maxMove: number
  cooldown: number
}

export interface ReqVerifyRoom {
  roomId: string
  accountId: string
}

export interface ResVerifyRoom {
  status: boolean
  reason?: string
}

export const getRoom = async (roomId: string) => {
  return fetchApi<ResGetRoom>(`/rooms/${roomId}`)
}

export const getRooms = async () => {
  return fetchApi<ResGetRoom[]>(`/rooms`)
}

export const createRoom = async (params: ReqCreateRoom) => {
  return fetchApi<ResGetRoom>('/rooms', 'POST', params)
}

export const verifyRoom = async (params: ReqVerifyRoom) => {
  return fetchApi<ResVerifyRoom>('/rooms/verify', 'POST', params)
}
