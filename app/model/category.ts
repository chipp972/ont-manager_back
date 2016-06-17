/**
 * List of categories of stock
 */
import {model, Schema} from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {SubCategory} from './sub_category'
import {Order} from './order'

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

// cascade delete of sub_category
CategorySchema.pre('remove', function (next: Function): void {
  SubCategory.remove({ categoryId: this._id }).exec()
  next()
})

// cascade delete of stock in orders
// CategorySchema.pre('remove', function (next: Function): void {
//   Order.find()
//   Order.remove({ categoryId: this._id }).exec()
//   next()
// })

CategorySchema.plugin(autoIncr.plugin, modelName)
export let Category = model(modelName, CategorySchema)
