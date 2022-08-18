import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync'
import User, { IUser } from '../models/user.model'
import config from '../config/config'
import { AUTH_COOKIE_EXPIRE_DEFAULT } from '../constants/auth'

const generateToken = (payload: any) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: AUTH_COOKIE_EXPIRE_DEFAULT })
}

const toUser = (user: IUser, accessToken: string) => ({ user: { ...user, id: user._id }, accessToken })

const signIn = catchAsync(async (req, res) => {
  const { providerAccountId, name, email, provider } = req.body ?? {}
  const body = { providerAccountId, name, email, provider }

  const foundUser = await User.findOne({ providerAccountId })
  if (foundUser) {
    const accessToken = generateToken(body)
    return res.status(httpStatus.OK).send({ data: toUser(foundUser, accessToken) })
  }

  const newUser = await User.create(body)
  if (!newUser) {
    return res.status(httpStatus.BAD_REQUEST).send({ error: 'Sign in error!' })
  }

  const accessToken = generateToken(body)
  return res.status(httpStatus.OK).send({ data: toUser(newUser, accessToken) })
})

export default {
  signIn,
}
