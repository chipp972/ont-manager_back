/**
 * List of sub categories of stock
 */
import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {checkRef} from './utils'
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
  },
  upperCategoryId: { ref: 'Category', type: Number }
})

// Plugins
CategorySchema.plugin(autoIncr.plugin, modelName)
export let CategoryModel = mongoose.model(modelName, CategorySchema)

// validate upperCategoryId
checkRef(CategorySchema, 'upperCategoryId', CategoryModel)

// block delete of category if used in an order
CategorySchema.pre('remove', function (next: Function): void {
  let category = this
  OrderModel.find({}).exec()
  .then((orderList) => {
    for (let order of orderList) {
      for (let stock of order.get('stock')) {
        if (stock.categoryId === category._id) {
          next(new Error('Category used in an order'))
        }
      }
    }

    // if it's not in any order we replace it in all children category
    CategoryModel.find({ upperCategoryId: category.upperCategoryId }).exec()
    .then((categoryList) => {
      let length = categoryList.length
      let cc = 0
      for (let c of categoryList) {
        c.set('upperCategoryId', category.upperCategoryId)
        c.save((err) => {
          cc++
          if (cc === length) {
            next() // we can suppress
          }
        })
      }
    })

  })
})
