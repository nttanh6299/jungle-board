import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync'
import User from '../models/user.model'
import Item from '../models/item.model'
import UserItem from '../models/userItem.model'
import { hasUserId } from '../utils'
import { ERROR_TYPE } from '../constants/errorType'

const buyTheme = catchAsync(async (req, res) => {
  if (hasUserId(req)) {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Unauthorized' })
    }

    const { themeId = '' } = req.body ?? {}
    const theme = await Item.findById(themeId)
    if (!theme) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ data: null, status: httpStatus.BAD_REQUEST, type: ERROR_TYPE.themeNotFound })
    }

    const canBuyTheme = user.coin >= theme.price
    if (!canBuyTheme) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ data: null, status: httpStatus.BAD_REQUEST, type: ERROR_TYPE.notEnoughCoin })
    }

    await Promise.all([
      User.findOneAndUpdate({ _id: user.id }, { $inc: { coin: -theme.price } }),
      UserItem.create({ userId: user.id, itemId: theme.id, quantity: 1 }),
    ])

    return res.status(httpStatus.OK).send({ data: true })
  }
})

export default {
  buyTheme,
}
