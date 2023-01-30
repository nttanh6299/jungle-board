import { Schema, model, Document, Types } from 'mongoose'

export interface ITheme extends Document {
  itemId: Types.ObjectId
  playerDen: string
  opponentDen: string
  trap: string
  land: string
  river: string
  borderLand: string
  borderPossibleMove: string
  borderSelected: string
}

const themeSchema: Schema = new Schema<ITheme>({
  itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
  playerDen: { type: String, required: true },
  opponentDen: { type: String, required: true },
  trap: { type: String, required: true },
  land: { type: String, required: true },
  river: { type: String, required: true },
  borderLand: { type: String, required: true },
  borderPossibleMove: { type: String, required: true },
  borderSelected: { type: String, required: true },
})

export default model<ITheme>('Theme', themeSchema)
