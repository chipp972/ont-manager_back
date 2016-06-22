/**
 * places where the stocks are
 */
import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {Order} from './order'

const modelName = 'Place'

export let PlaceSchema = new mongoose.Schema({
  address: String,
  description: String,
  internalStock: { default: true, type: Boolean },
  name: {
    index: { unique: true },
    lowercase: true,
    required: true,
    trim: true,
    type: String
  }
})

// Plugins
PlaceSchema.plugin(autoIncr.plugin, modelName)
export let Place = mongoose.model(modelName, PlaceSchema)

// block delete if orders with this placeId remains
PlaceSchema.pre('remove', function (next: Function): void {
  let errMsg = 'Orders with this place remain'
  Order.find({ placeIdSource: this._id }).exec()
  .then((orderList1) => {
    if (orderList1.length > 0) {
      next(new Error(errMsg))
    } else {
      Order.find({ placeIdDestination: this._id }).exec()
      .then((orderList2) => {
        if (orderList2.length > 0) {
          next(new Error(errMsg))
        } else {
          next()
        }
      }, err => next(new Error(errMsg)))
    }
  }, err => next(new Error(errMsg)))
})
