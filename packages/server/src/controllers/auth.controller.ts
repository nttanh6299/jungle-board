import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync'
import User from '../models/user.model'
import config from '../config/config'
import { AUTH_COOKIE_EXPIRE_DEFAULT } from '../constants/auth'

const generateToken = (payload: any) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: AUTH_COOKIE_EXPIRE_DEFAULT })
}

const signIn = catchAsync(async (req, res) => {
  const { providerAccountId, name, email, provider } = req.body ?? {}
  const body = { providerAccountId, name, email, provider }

  const foundUser = await User.findOne({ providerAccountId })
  if (foundUser) {
    const accessToken = generateToken(body)
    return res.status(httpStatus.OK).send({ data: { user: foundUser, accessToken } })
  }

  const newUser = await User.create(body)
  if (!newUser) {
    return res.status(httpStatus.BAD_REQUEST).send({ error: 'Sign in error!' })
  }

  const accessToken = generateToken(body)
  return res.status(httpStatus.OK).send({ data: { user: newUser, accessToken } })
})

export default {
  signIn,
}
