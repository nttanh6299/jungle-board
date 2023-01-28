import { fetchApi } from 'apis/apiCaller'

export interface ReqCreateItem {
  name: string
  type: string
  price: number
  image: string
}

export interface ResGetTheme {
  id: string
  name: string
  image: string
  price: number
  isDefault: boolean
}

export const createItem = async (params: ReqCreateItem) => {
  return fetchApi('/items', 'POST', params)
}

export const getThemes = async () => {
  return fetchApi<ResGetTheme[]>('/items/themes')
}
