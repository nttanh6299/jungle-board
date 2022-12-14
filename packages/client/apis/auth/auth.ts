import { fetchApi } from 'apis/apiCaller'
import { ReqUser, ResUser, UserInfo } from './auth.types'

export const signIn = async (payload: ReqUser) => {
  return fetchApi<ResUser>(`/auth/signIn`, 'POST', payload)
}

export const getMe = async () => {
  return fetchApi<UserInfo>(`/auth/me`, 'GET')
}
