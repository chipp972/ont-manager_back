import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {Order} from '../type/model.d.ts'
import {checkRef} from './utils'
import {StockSchema} from './stock'
import {UserModel} from './user'
import {PlaceModel} from './place'
import {StockState} from '../lib/stock_state'

const modelName = 'Order'

let states = [ 'reservation', 'delivered', 'sending', 'partial', 'cancel' ]

export let OrderSchema = new mongoose.Schema({
  date: Date,
  deliveryDate: Date,
  placeIdDestination: { ref: 'Place', required: true, type: Number },
  placeIdSource: { ref: 'Place', required: true, type: Number },
  receivedStock: [StockSchema],
  reference: String,
  state: { default: false, enum: states, type: String },
  stock: [StockSchema],
  userId: { ref: 'User', required: true, type: Number }
})

// Plugins
OrderSchema.plugin(autoIncr.plugin, modelName)

// check if the stock required is present in the source
OrderSchema.pre('save', function (next: Function): void {
  let order = this

  if (!order.receivedStock) {
    order.receivedStock = []
  }

  PlaceModel.findOne({ _id: order.placeIdSource }).exec()
  .then((sourcePlace) => {
    if (sourcePlace.get('internalStock')) { // verification needed
      let errMsg2 = `Not enough stock in place: ${sourcePlace.get('name')}`
      let placeId = sourcePlace.get('_id')
      order.date = order.date || new Date()

      let placeStockState = new StockState(placeId, order.date)

      placeStockState.hasEnoughStock(order.stock)
      .then((hasEnough) => {
        if (hasEnough) {
          return next()
        } else {
          return next(new Error(errMsg2))
        }
      })

    } else {
      return next() // no need for verification since the source is external
    }
  }, (err) => next(err))
})

// check for user alerts on the stock
OrderSchema.post('save', (order, next) => {
  // alertCheck(order)
  next()
})

// reference validations
checkRef(OrderSchema, 'userId', UserModel)
checkRef(OrderSchema, 'placeIdDestination', PlaceModel)
checkRef(OrderSchema, 'placeIdSource', PlaceModel)

// validate reference (the field)
OrderSchema.path('reference').validate((value, next) => {
  let order = this

  // check if it's a reservation when there is no reference
  if (! value) {
    if (! order.reservation) {
      next(false)
    } else {
      next(true)
    }
  } else {
    next()
  }
}, 'reference is not valid')

/** function to compare stock and receivedStock
 * if they are the same -> []
 * else it will send an array with the stocks and the lacking quantity
 */
// OrderSchema.methods.compareStocks =
// function ()

export let OrderModel = mongoose.model<Order>(modelName, OrderSchema)
