import express from 'express'
import uploadController from '../controllers/upload.controller'

const uploadRoute = express.Router()
uploadRoute.post('/', uploadController.upload)

export default uploadRoute
