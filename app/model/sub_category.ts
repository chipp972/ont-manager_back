/**
 * List of sub categories of stock
 */
import {model, Schema} from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {Category} from './category'

const modelName = 'SubCategory'

export let SubCategorySchema = new Schema({
  categoryId: {
    ref: 'Category',
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

// validate categoryId
SubCategorySchema.path('categoryId').validate((value, respond) => {
  Category.findOne({ _id: value }, (err, document) => {
    if (err || ! document) {
      respond(false)
    } else {
      respond(true)
    }
  })
}, `categoryId doesn\'t correspond to any document in Category`)

SubCategorySchema.plugin(autoIncr.plugin, modelName)
export let SubCategory = model(modelName, SubCategorySchema)
