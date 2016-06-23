/**
 * List of sub categories of stock
 */
import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {Order} from './order'

const modelName = 'Category'

export let CategorySchema = new mongoose.Schema({
  description: String,
  name: {
    index: { unique: true },
    lowercase: true,
    required: true,
    trim: true,
    type: String
  },
  subCategoryId: [{ ref: 'Category', type: Number }]
})

// Plugins
CategorySchema.plugin(autoIncr.plugin, modelName)
export let Category = mongoose.model(modelName, CategorySchema)

/**
 * TODO verif pas de recursivité
 */

// validate subCategoryId
CategorySchema.path('subCategoryId').validate((value, next) => {
  let promiseList = []
  for (let subcategory of value) {
    let p = Category.findOne({ _id: subcategory }).exec()
    .then((document) => {
      if (! document) {
        p.reject(new Error())
      } else {
        p.resolve()
      }
    }, err => p.reject(new Error()))
    promiseList.push(p)
  }
  Promise.all(promiseList)
  .then(() => next(true))
  .catch((err) => next(false))
}, 'subCategoryId doesn\'t correspond to any document in Category')

// block delete of category if used as a subCategory or in order
CategorySchema.pre('remove', function (next: Function): void {
  let category = this
  Order.find({}).exec()
  .then((orderList) => {
    for (let order of orderList) {
      for (let stock of order.get('stock')) {
        if (stock.categoryId === category._id) {
          next(new Error('Category used in an order'))
        }
      }
    }
    next()
  })
})
