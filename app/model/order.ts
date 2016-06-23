import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {checkRef} from './utils'
import {StockSchema} from './stock'
import {User} from './user'
import {Place} from './place'
import {getStockState, hasEnoughStock} from '../lib/stock_state'
import {alertCheck} from '../lib/alert'

const modelName = 'Order'

export let OrderSchema = new mongoose.Schema({
  date: Date,
  file: [{
    contentType: { required: true, type: String},
    data: { required: true, type: Buffer},
    description: String,
    name: { lowercase: true, required: true, trim: true, type: String}
  }],
  placeIdDestination: { ref: 'Place', required: true, type: Number },
  placeIdSource: { ref: 'Place', required: true, type: Number },
  reference: String,
  reservation: { default: false, type: Boolean },
  stock: [StockSchema],
  userId: { ref: 'User', required: true, type: Number }
})

// Plugins
OrderSchema.plugin(autoIncr.plugin, modelName)
export let Order = mongoose.model('Order', OrderSchema)

// check if the stock required is present in the source
OrderSchema.pre('save', function (next: Function): void {
  let order = this

  Place.findOne({ _id: order.placeIdSource }).exec()
  .then((sourcePlace) => {
    if (sourcePlace.get('internalStock')) { // verification needed
      let errMsg2 = 'Not enough stock in source place'
      let placeId = sourcePlace.get('_id')

      if (! order.date) {
        order.date = new Date()
      }

      getStockState(placeId, order.date)
      .then((stockState) => {
        if (hasEnoughStock(stockState, order.stock)) {
          next()
        } else {
          next(new Error(errMsg2))
        }
      })

    } else {
      next() // no need for verification since the source is external
    }
  }, (err1) => {
    let errMsg1 = 'placeIdSource doesn\'t correspond to any document in Place'
    next(new Error(errMsg1))
  })
})

// check for user alerts on the stock
OrderSchema.post('save', (order) => {
  alertCheck(order)
})

// reference validations
checkRef(OrderSchema, 'userId', User)
checkRef(OrderSchema, 'placeIdDestination', Place)
checkRef(OrderSchema, 'placeIdSource', Place)

// validate reference
OrderSchema.path('reference').validate((value, next) => {
  let order = this
  console.log(order)
  // check if it's a reservation when there is no reference
  if (! value) {
    if (! order.reservation) {
      next(false)
    } else {
      next(true)
    }
  }
}, 'reference is not valid')
