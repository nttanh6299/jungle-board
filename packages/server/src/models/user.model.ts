import { Schema, model, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email?: string
  image?: string
  provider: string
  providerAccountId: string
  isActive?: boolean
  accessToken?: string
  xp: number
  win: number
  lose: number
  coin: number
  createdAt: Date
  updatedAt: Date
}

const userSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String },
  image: { type: String },
  provider: { type: String, required: true },
  providerAccountId: { type: String, required: true },
  isActive: { type: Boolean },
  xp: { type: Number, default: 0 },
  win: { type: Number, default: 0 },
  lose: { type: Number, default: 0 },
  coin: { type: Number, default: 0 },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
})

export default model<IUser>('User', userSchema)
