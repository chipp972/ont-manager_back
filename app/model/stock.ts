import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {Stock} from '../type/model.d.ts'
// import {checkRef} from './utils'
// import {ProductModel} from './product'
import {OrderModel} from './order'
import {DeliveryModel} from './delivery'

const modelName = 'Stock'

export let StockSchema = new mongoose.Schema({
  deliveryId: { ref: 'Delivery', type: Number },
  description: String,
  orderId: { ref: 'Order', type: Number },
  productId: { ref: 'Product', required: true, type: Number },
  quantity: { default: 1, type: Number },
  unitPrice: { default: 0, type: Number }
})

// Plugins
StockSchema.plugin(autoIncr.plugin, modelName)

// reference validation
// checkRef(StockSchema, 'productId', ProductModel)

StockSchema.pre('save', function (next: Function): void {
  let stock = this
  if (!stock.orderId && !stock.deliveryId) {
    return next(new Error('Lack a reference to an order or a delivery'))
  }
  if (stock.orderId) {
    OrderModel.findById(stock.orderId).exec()
    .then((document) => {
      if (!document) {
        next(new Error('Invalid order id'))
      }
    }, err => next(err))
  } else {
    DeliveryModel.findById(stock.deliveryId).exec()
    .then((document) => {
      if (!document) {
        next(new Error('Invalid delivery id'))
      }
    }, err => next(err))
  }
  next()
})

export let StockModel = mongoose.model<Stock>(modelName, StockSchema)
