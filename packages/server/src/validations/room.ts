import Joi from 'joi'

const getRoom = {
  params: Joi.object().keys({
    roomId: Joi.string(),
  }),
}

const verifyRoom = {
  params: Joi.object().keys({
    roomId: Joi.string(),
    accountId: Joi.string(),
  }),
}

const roomValidation = {
  getRoom,
  verifyRoom,
}

export default roomValidation
