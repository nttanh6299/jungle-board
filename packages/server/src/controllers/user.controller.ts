import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync'
import User from '../models/user.model'
import Item from '../models/item.model'
import UserItem from '../models/userItem.model'
import { hasUserId } from '../utils'
import ApiError from '../utils/ApiError'

const buyTheme = catchAsync(async (req, res) => {
  if (hasUserId(req)) {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).send({ error: 'Unauthorized' })
    }

    const { themeId = '' } = req.body ?? {}
    const theme = await Item.findById(themeId)
    if (!theme) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Theme not found')
    }

    const canBuyTheme = user.coin >= theme.price
    if (!canBuyTheme) {
      throw new ApiError(httpStatus.BAD_REQUEST, `You don't have enough coins to buy that item`)
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
