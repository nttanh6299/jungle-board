import { Schema, model, Document, Types } from 'mongoose'

export interface IMatch extends Document {
  roomId: Types.ObjectId
  winnerId: string
  playerId1: string
  playerId2: string
  move: number
  time: number
  isTie: boolean
  createdAt: Date
}

const matchSchema: Schema = new Schema<IMatch>({
  roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
  playerId1: { type: String },
  playerId2: { type: String },
  winnerId: { type: String },
  move: { type: Number, default: 0 },
  time: { type: Number, default: 0 },
  isTie: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
})

export default model<IMatch>('Match', matchSchema)
