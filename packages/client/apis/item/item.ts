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
  config?: ThemeConfig
}

export interface ThemeConfig {
  _id?: string
  id?: string
  itemId: string
  playerDen: string
  opponentDen: string
  trap: string
  land: string
  river: string
  borderLand: string
  borderPossibleMove: string
  borderSelected: string
}

export type ReqThemeConfig = ThemeConfig

export const createItem = async (params: ReqCreateItem) => {
  return fetchApi('/items', 'POST', params)
}

export const getThemes = async () => {
  return fetchApi<ResGetTheme[]>('/items/themes')
}

export const configTheme = async (params: ReqThemeConfig) => {
  return fetchApi('/items/config', 'POST', params)
}
