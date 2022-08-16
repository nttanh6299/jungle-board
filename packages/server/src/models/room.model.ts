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
  createdAt: Date
}

const roomSchema: Schema = new Schema<IRoom>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ERoomStatus, default: ERoomStatus.WAITING },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: new Date() },
})

export default model<IRoom>('Room', roomSchema)
