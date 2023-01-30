import { Schema, model, Document, Types } from 'mongoose'

export enum ItemType {
  THEME = 'theme',
}

export interface IItem extends Document {
  name: string
  type: string
  image: string
  price: number
  isDefault: boolean
  config: Types.ObjectId
}

const itemSchema: Schema = new Schema<IItem>({
  name: { type: String },
  type: { type: String },
  image: { type: String },
  price: { type: Number, default: 0 },
  isDefault: { type: Boolean },
  config: { type: Schema.Types.ObjectId, ref: 'Theme' },
})

export default model<IItem>('Item', itemSchema)
