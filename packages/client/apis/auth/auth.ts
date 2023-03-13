import { fetchApi } from 'apis/apiCaller'

export type ReqUser = {
  provider: string
  accessToken: string
  idToken?: string
}

export type ResUser = {
  user: ReqUser
  accessToken: string
}

export type UserInfo = {
  id: string
  name: string
  xp: number
  win: number
  lose: number
  tie: number
  coin: number
  themeIds: string[]
}

export const signIn = async (payload: ReqUser) => {
  return fetchApi<ResUser>(`/auth/signIn`, 'POST', payload)
}

export const getMe = async () => {
  return fetchApi<UserInfo>(`/auth/me`, 'GET')
}

export const signInAdmin = async (passcode: string) => {
  return fetchApi<boolean>(`/auth/admin`, 'POST', { passcode })
}
