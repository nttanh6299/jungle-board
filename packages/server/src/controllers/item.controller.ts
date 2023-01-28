import httpStatus from 'http-status'
import Item from '../models/item.model'
import ApiError from '../utils/ApiError'
import catchAsync from '../utils/catchAsync'

const createItem = catchAsync(async (req, res) => {
  const newItem = await Item.create(req.body)

  if (!newItem) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot create item')
  }

  return res.status(httpStatus.OK).send({ data: newItem })
})

const getThemes = catchAsync(async (_, res) => {
  const themes = await Item.find({ type: 'theme' })

  if (!themes?.length) {
    return res.status(httpStatus.OK).send({ data: [] })
  }

  return res.status(httpStatus.OK).send({
    data: themes.map(({ id, name, image, price, isDefault }) => ({
      id,
      name,
      image,
      price,
      isDefault,
    })),
  })
})

const itemController = {
  createItem,
  getThemes,
}

export default itemController
