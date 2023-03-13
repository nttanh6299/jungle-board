import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync'
import User, { IUser } from '../models/user.model'
import UserItem from '../models/userItem.model'
import config from '../config/config'
import { AUTH_COOKIE_EXPIRE_DEFAULT } from '../constants/auth'
import { hasUserId } from '../utils'
import authService, { SocialUser } from '../services/auth'

const generateToken = (payload: any) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: AUTH_COOKIE_EXPIRE_DEFAULT })
}

const toUser = (user: IUser, accessToken: string) => ({ user: { ...user, id: user._id }, accessToken })

const signIn = catchAsync(async (req, res) => {
  const { provider, accessToken, idToken } = req.body ?? {}

  let user: SocialUser | null = null
  switch (provider) {
    case 'google':
      user = await authService.google(accessToken, idToken)
      break
    case 'facebook':
      user = await authService.facebook(accessToken)
      break
    case 'github':
      user = await authService.github(accessToken)
      break
    default:
      break
  }

  if (!user) {
    return res.status(httpStatus.BAD_REQUEST).send({ error: 'Sign in error' })
  }

  const foundUser = await User.findOne({ providerAccountId: user.providerAccountId })
  if (foundUser) {
    const accessToken = generateToken({ sub: foundUser.id })
    return res.status(httpStatus.OK).send({ data: toUser(foundUser, accessToken) })
  }

  const newUser = await User.create({ ...user, isAdmin: false })
  if (!newUser) {
    return res.status(httpStatus.BAD_REQUEST).send({ error: 'Sign in error' })
  }

  const newAccessToken = generateToken({ sub: newUser.id })
  return res.status(httpStatus.OK).send({ data: toUser(newUser, newAccessToken) })
})

const getUserStats = catchAsync(async (req, res) => {
  if (hasUserId(req)) {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Unauthorized' })
    }
    const { id, name, xp, win, lose, tie, coin } = user ?? {}

    const userItems = await UserItem.find({ userId: id })
    const themeIds = userItems?.map((item) => item.itemId) || []

    return res.status(httpStatus.OK).send({ data: { id, name, xp, win, lose, tie, coin, themeIds } })
  }
})

const signInAdmin = catchAsync(async (req, res) => {
  const passcode = req.body?.passcode || ''
  return res.status(httpStatus.OK).send({ data: passcode === config.adminPasscode })
})

export default {
  signIn,
  getUserStats,
  signInAdmin,
}
