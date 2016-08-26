import {Category} from '../type/model.d.ts'
import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {OrderModel} from './order'

const modelName = 'Category'

export let CategorySchema = new mongoose.Schema({
  description: String,
  name: {
    index: { unique: true },
    lowercase: true,
    required: true,
    trim: true,
    type: String
  }
})

// Plugins
CategorySchema.plugin(autoIncr.plugin, modelName)

// block delete of category if used in an order
CategorySchema.pre('remove', function (next: Function): void {
  let category = this
  OrderModel.find({}).exec()
  .then((orderList) => {
    for (let order of orderList) {
      for (let stock of order.get('stock')) {
        if (stock.categoryId === category._id) {
          return next(new Error('Category used in an order'))
        }
      }
    }
    next()
  })
})

export let CategoryModel = mongoose.model<Category>(modelName, CategorySchema)
