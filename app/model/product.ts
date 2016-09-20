import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {Product} from '../type/model.d.ts'
import {checkRef} from './utils'
import {StockModel} from './stock'
import {AttachmentModel} from './attachment'

const modelName = 'Product'

export let ProductSchema = new mongoose.Schema({
  code: { index: { unique: true}, required: true, type: String },
  description: { required: true, type: String },
  fileId: { ref: 'Attachment', type: Number }
})

// Plugins
ProductSchema.plugin(autoIncr.plugin, modelName)

// reference validation
checkRef(ProductSchema, 'fileId', AttachmentModel)

// block delete of product_code if used in a stock
ProductSchema.pre('remove', function (next: Function): void {
  let product = this
  StockModel.find({ productId: product._id }).exec()
  .then((stockList) => {
    if (stockList.length > 0) {
      return next(new Error('Product used in at least a stock'))
    }
    next()
  })
})

export let ProductModel =
  mongoose.model<Product>(modelName, ProductSchema)
