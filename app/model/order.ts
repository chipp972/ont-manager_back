import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {StockSchema} from './stock'
import {User} from './user'
import {Place} from './place'

const modelName = 'Order'

export let OrderSchema = new mongoose.Schema({
  date: { default: new Date(), type: Date },
  file: [{
    contentType: { required: true, type: String},
    data: { required: true, type: Buffer},
    description: String,
    name: { lowercase: true, required: true, trim: true, type: String}
  }],
  placeIdDestination: { ref: 'Place', required: true, type: Number },
  placeIdSource: { ref: 'Place', required: true, type: Number },
  reference: { index: { unique: true }, required: true, type: String },
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
    let errMsg2 = 'Not enough stock in source place'
    if (sourcePlace.get('internalStock')) { // verification needed

      // find stock state
      Order.find({
        date: { $lt: order.date },
        placeIdDestination: sourcePlace.get('_id')
      }).exec()
      .then((orderList) => {
        if (! orderList) {
          next(new Error(errMsg2))
        } else {
          // stock inputs
          for (let currOrder of orderList) {
            for (let stock of currOrder.get('stock')) {
              console.log(stock)
            }
          }
          next()
        }
      }, err2 => next(new Error(errMsg2)))

      // let stock = getStockState(sourcePlace._id)
      // if (hasEnough(order.stock, stock)) {
      //   next()
      // } else {
      //   next(new Error(errMsg2))
      // }
    } else {
      next() // no need for verification since the source is external
    }
  }, (err1) => {
    let errMsg1 = 'placeIdSource doesn\'t correspond to any document in Place'
    next(new Error(errMsg1))
  })
})

// validate userId
OrderSchema.path('userId').validate((value, next) => {
  User.findOne({ _id: value }).exec()
  .then((document) => {
    if (! document) {
      next(false)
    } else {
      next(true)
    }
  }, err => next(false))
}, 'userId doesn\'t correspond to any document in User')

// validate placeIdDestination
OrderSchema.path('placeIdDestination').validate((value, next) => {
  Place.findOne({ _id: value }).exec()
  .then((document) => {
    if (! document) {
      next(false)
    } else {
      next(true)
    }
  }, err => next(false))
}, 'placeIdDestination doesn\'t correspond to any document in Place')
