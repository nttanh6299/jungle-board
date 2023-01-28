import { Schema, model, Document, Types } from 'mongoose'

export interface IUserItem extends Document {
  userId: Types.ObjectId
  itemId: Types.ObjectId
  quantity: number
}

const userItemSchema: Schema = new Schema<IUserItem>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
  quantity: { type: Number, require: true },
})

export default model<IUserItem>('UserItem', userItemSchema)
