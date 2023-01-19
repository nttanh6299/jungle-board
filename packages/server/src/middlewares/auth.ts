import httpStatus from 'http-status'
import jwt from 'jsonwebtoken'
import config from '../config/config'

export const authenticateJwt = (req, res, next) => {
  const authorization = String(req.headers.authorization)
  const authorizationParts = authorization?.split(' ')

  if (!authorizationParts || authorizationParts?.[0]?.toLowerCase() !== 'bearer') {
    return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Invalid token' })
  }

  jwt.verify(authorizationParts?.[1], config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Unauthorized' })
    }
    req.userId = user.id
    next()
  })
}

export const getUserFromJwt = (req, _, next) => {
  const authorization = String(req.headers.authorization)
  const authorizationParts = authorization?.split(' ')

  jwt.verify(authorizationParts?.[1], config.jwt.secret, (_, user) => {
    if (user?.id) {
      req.userId = user.id
    }
    next()
  })
}
