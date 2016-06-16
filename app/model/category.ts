/**
 * List of categories of stock
 */
import {model, Schema} from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

const modelName = 'Category'

export let CategorySchema = new Schema({
  description: String,
  name: {
    index: { unique: true },
    lowercase: true,
    required: true,
    trim: true,
    type: String
  }
})

CategorySchema.plugin(autoIncr.plugin, modelName)
export let Category = model(modelName, CategorySchema)
