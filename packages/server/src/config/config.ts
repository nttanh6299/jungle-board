import 'dotenv/config'
import Joi from 'joi'

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3001),
    MONGODB_URI: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    ALLOWLIST_HOSTS: Joi.string().required(),
    CLOUDINARY_NAME: Joi.string().required(),
    CLOUDINARY_API_KEY: Joi.string().required(),
    CLOUDINARY_SECRET_KEY: Joi.string().required(),
  })
  .unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env)

if (error) {
  throw new Error(`Config validation error: ${error.message}`)
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URI,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
  },
  cors: envVars.ALLOWLIST_HOSTS.split(','),
  cloudinary: {
    name: envVars.CLOUDINARY_NAME,
    apiKey: envVars.CLOUDINARY_API_KEY,
    secretKey: envVars.CLOUDINARY_SECRET_KEY,
  },
}
