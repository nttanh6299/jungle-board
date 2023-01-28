import { Schema, model, Document, Types } from 'mongoose'

export enum ERoomStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  END = 'end',
  TIE = 'tie',
}

export interface IRoom extends Document {
  theme: Types.ObjectId
  name: string
  type: string
  status: ERoomStatus
  isActive: boolean
  maxMove: number
  cooldown: number
  isPrivate: boolean
  createdAt: Date
}

const roomSchema: Schema = new Schema<IRoom>({
  theme: { type: Schema.Types.ObjectId, ref: 'Item' },
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ERoomStatus, default: ERoomStatus.WAITING },
  isActive: { type: Boolean, default: true },
  maxMove: { type: Number, default: 0 },
  cooldown: { type: Number, default: 0 },
  isPrivate: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export default model<IRoom>('Room', roomSchema)
