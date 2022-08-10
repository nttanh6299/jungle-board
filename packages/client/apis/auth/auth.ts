import { fetchApi } from 'apis/apiCaller'
import { ReqUser, ResUser } from './auth.types'

export const signIn = async (payload: ReqUser) => {
  return fetchApi<ResUser>(`/auth/signIn`, 'POST', payload)
}
