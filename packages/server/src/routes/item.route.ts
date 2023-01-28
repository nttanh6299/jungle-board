import express from 'express'
import itemController from '../controllers/item.controller'
import { getUserFromJwt } from '../middlewares/auth'

const itemRoute = express.Router()
itemRoute.get('/themes', getUserFromJwt, itemController.getThemes)
itemRoute.post('/', itemController.createItem)

export default itemRoute
