import { Schema, model, Document } from 'mongoose'

export enum ERoomStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  END = 'end',
  TIE = 'tie',
}

export interface IRoom extends Document {
  name: string
  type: string
  status: ERoomStatus
  isActive: boolean
  maxMove: number
  cooldown: number
  createdAt: Date
}

const roomSchema: Schema = new Schema<IRoom>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ERoomStatus, default: ERoomStatus.WAITING },
  isActive: { type: Boolean, default: true },
  maxMove: { type: Number, default: 0 },
  cooldown: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

export default model<IRoom>('Room', roomSchema)
