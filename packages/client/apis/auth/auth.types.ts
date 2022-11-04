export type ReqUser = {
  id?: string
  name: string
  email: string
  image?: string
  provider: string
  providerAccountId: string
  accessToken?: string
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
}
