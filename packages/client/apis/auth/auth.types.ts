export type ReqUser = {
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