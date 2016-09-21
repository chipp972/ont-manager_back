import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {Stock} from '../type/model.d.ts'
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

StockSchema.pre('save', function (next: Function): void {
  let stock = this
  console.log(stock)
  if (!stock.orderId && !stock.deliveryId) {
    return next(new Error('Lack a reference to an order or a delivery'))
  }
  if (stock.orderId && !stock.deliveryId) {
    OrderModel.findById(stock.orderId).exec()
    .then((order) => {
      if (!order) {
        next(new Error('Invalid orderId'))
      }
      next()
    }, err => next(err))
  } else if (stock.deliveryId && !stock.orderId) {
    DeliveryModel.findById(stock.deliveryId).exec()
    .then((delivery) => {
      if (!delivery) {
        next(new Error('Invalid deliveryId'))
      }
      // TODO check if all stocks from the deliveries of the corresponding order
      // + this one is equal or inferior to the stocks of the order
      // if it's equal change order state to "delivered" and if it's inferior
      // change it to "partial". If it's superior return an error
      next()
    }, err => next(err))
  }
  next(new Error('The stock cannot be for a delivery and an order'))
})

export let StockModel = mongoose.model<Stock>(modelName, StockSchema)
