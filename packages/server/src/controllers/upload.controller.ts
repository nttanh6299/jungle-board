import { v2 as cloudinary } from 'cloudinary'
import httpStatus from 'http-status'
import config from '../config/config'
import { ERROR_TYPE } from '../constants/errorType'
import catchAsync from '../utils/catchAsync'

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.secretKey,
})

const upload = catchAsync(async (req, res) => {
  const files = req.body

  if (!files) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ data: null, status: httpStatus.BAD_REQUEST, type: ERROR_TYPE.fileNotFound })
  }

  const uploadedImages: { publicId: string; preview: string }[] = []
  for (const fi in files) {
    await cloudinary.uploader.upload(
      files[fi],
      { folder: 'JungleBoardItems', use_filename: true, unique_filename: false },
      async (err, result) => {
        if (err) throw err
        if (result) {
          uploadedImages.push({
            publicId: result.public_id,
            preview: result.secure_url,
          })
        }
      },
    )
  }
  return res.status(httpStatus.OK).send({ data: uploadedImages })
})

const uploadController = {
  upload,
}

export default uploadController
