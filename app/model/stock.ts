import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {Category} from './category'

const modelName = 'Stock'

export let StockSchema = new mongoose.Schema({
  categoryId: { ref: 'Category', type: Number },
  description: String,
  quantity: { default: 1, type: Number },
  unitPrice: { default: 0, type: Number }
})

// Plugins
StockSchema.plugin(autoIncr.plugin, modelName)

// validate categoryId
StockSchema.path('categoryId').validate((value, next) => {
  Category.findOne({ _id: value }).exec()
  .then((document) => {
    if (! document) {
      next(false)
    } else {
      next(true)
    }
  }, err => next(false))
}, 'categoryId doesn\'t correspond to any document in Category')
