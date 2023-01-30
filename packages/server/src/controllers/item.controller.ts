import httpStatus from 'http-status'
import { ERROR_TYPE } from '../constants/errorType'
import Item from '../models/item.model'
import Theme, { ITheme } from '../models/theme.model'
import catchAsync from '../utils/catchAsync'

const createItem = catchAsync(async (req, res) => {
  const newItem = await Item.create(req.body)

  if (!newItem) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ data: null, status: httpStatus.BAD_REQUEST, type: ERROR_TYPE.createItemFailed })
  }

  return res.status(httpStatus.OK).send({ data: newItem })
})

const getThemes = catchAsync(async (_, res) => {
  const themes = await Item.find({ type: 'theme' }).populate<{ config: ITheme }>({ path: 'config' })

  if (!themes?.length) {
    return res.status(httpStatus.OK).send({ data: [] })
  }

  return res.status(httpStatus.OK).send({
    data: themes.map(({ id, name, image, price, isDefault, config }) => ({
      id,
      name,
      image,
      price,
      isDefault,
      config,
    })),
  })
})

const configTheme = catchAsync(async (req, res) => {
  const { id, ...body } = req.body ?? {}

  if (id) {
    await Theme.findByIdAndUpdate(id, body)
  } else {
    const newTheme = await Theme.create(body)
    await Item.findByIdAndUpdate(body.itemId, { config: newTheme.id })
  }
  return res.status(httpStatus.OK).send({ data: true })
})

const itemController = {
  createItem,
  getThemes,
  configTheme,
}

export default itemController
