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
  tie: number
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
  tie: { type: Number, default: 0 },
  coin: { type: Number, default: 400 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default model<IUser>('User', userSchema)
