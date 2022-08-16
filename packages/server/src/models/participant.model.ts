import { Schema, model, Document, Types } from 'mongoose'

export enum EUserType {
  IDENTIFIED = 'identified',
  ANONYMOUS = 'anonymous',
}

export interface IParticipant extends Document {
  userType: string
  userId: Types.ObjectId
  matchId: Types.ObjectId
  roomId: Types.ObjectId
  anonymousUserId: string
  isSpectator: boolean
  createdAt: Date
}

const participantSchema: Schema = new Schema<IParticipant>({
  matchId: { type: Schema.Types.ObjectId, ref: 'Match' },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  anonymousUserId: { type: String },
  userType: { type: String, enum: EUserType, default: EUserType.IDENTIFIED },
  isSpectator: { type: Boolean, default: false },
  createdAt: { type: Date, default: new Date() },
})

export default model<IParticipant>('Participant', participantSchema)
