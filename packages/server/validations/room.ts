import Joi from 'joi'

const getRoom = {
  params: Joi.object().keys({
    roomId: Joi.string(),
  }),
}

const roomValidation = {
  getRoom,
}

export default roomValidation
