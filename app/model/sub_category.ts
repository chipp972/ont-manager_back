/**
 * List of sub categories of stock
 */
import {model, Schema} from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {CategorySchema} from './category'

const modelName = 'SubCategory'

export let SubCategorySchema = new Schema({
  category: {
    ref: CategorySchema,
    required: true,
    type: Number
  },
  description: String,
  name: {
    index: { unique: true },
    lowercase: true,
    required: true,
    trim: true,
    type: String
  }
})

SubCategorySchema.plugin(autoIncr.plugin, modelName)
export let SubCategory = model(modelName, SubCategorySchema)
