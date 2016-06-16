/**
 * places where the stocks are
 */
import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {StockSchema} from './stock'

const modelName = 'Place'

export let PlaceSchema = new mongoose.Schema({
  address: String,
  currentStock: [StockSchema],
  detail: String,
  name: {
    index: { unique: true },
    lowercase: true,
    required: true,
    trim: true,
    type: String
  }
})

PlaceSchema.plugin(autoIncr.plugin, modelName)
export let Place = mongoose.model(modelName, PlaceSchema)
