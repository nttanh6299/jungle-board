import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  image?: string
  provider: string
  providerAccountId: string
  isActive?: boolean
  accessToken?: string
  xp: number
  win: number
  lose: number
  coin: number
}

const userSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  image: { type: String },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true, unique: true },
  isActive: { type: Boolean },
  xp: { type: Number, default: 0 },
  win: { type: Number, default: 0 },
  lose: { type: Number, default: 0 },
  coin: { type: Number, default: 0 },
})

export default model<IUser>('User', userSchema)
