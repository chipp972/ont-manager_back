import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {ProductCode} from '../type/model.d.ts'
import {checkRef} from './utils'
import {OrderModel} from './order'
import {PlaceModel} from './place'

const modelName = 'ProductCode'

export let ProductCodeSchema = new mongoose.Schema({
  code: { index: { unique: true}, required: true, type: String },
  description: String,
  placeId: { ref: 'Place', type: Number }
})

// Plugins
ProductCodeSchema.plugin(autoIncr.plugin, modelName)

// reference validation
checkRef(ProductCodeSchema, 'placeId', PlaceModel)

// block delete of product_code if used in an order
ProductCodeSchema.pre('remove', function (next: Function): void {
  let productcode = this
  OrderModel.find({}).exec()
  .then((orderList) => {
    for (let order of orderList) {
      for (let stock of order.get('stock')) {
        if (stock.codeId === productcode._id) {
          return next(new Error('ProductCode used in at least an order'))
        }
      }
    }
    next()
  })
})

export let ProductCodeModel =
  mongoose.model<ProductCode>(modelName, ProductCodeSchema)
