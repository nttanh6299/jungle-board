import { Schema, model, Document } from 'mongoose'

export enum ItemType {
  THEME = 'theme',
}

export interface IItem extends Document {
  name: string
  type: string
  image: string
  price: number
  isDefault: boolean
}

const itemSchema: Schema = new Schema<IItem>({
  name: { type: String },
  type: { type: String },
  image: { type: String },
  price: { type: Number, default: 0 },
  isDefault: { type: Boolean },
})

export default model<IItem>('Item', itemSchema)
