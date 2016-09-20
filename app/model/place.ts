/**
 * places where the stocks are
 */
import {Place} from '../type/model.d.ts'
import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {OrderModel} from './order'
import {StockState} from '../lib/stock_state'

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

// hooks
PlaceSchema.pre('save', (next) => {
  // let place = this
  next()
})

// block delete if orders with this placeId remains
PlaceSchema.pre('remove', function (next: Function): void {
  let errMsg = 'Orders with this place remain in the database'
  OrderModel.find({ placeIdSource: this._id }).exec()
  .then((orderList1) => {
    if (orderList1.length > 0) {
      return next(new Error(errMsg))
    }
    OrderModel.find({ placeIdDestination: this._id }).exec()
    .then((orderList2) => {
      if (orderList2.length > 0) {
        return next(new Error(errMsg))
      }
      next()
    }, err => { return next(err) })
  }, err => { return next(err) })
})

PlaceSchema.methods.getStockState = async function (): Promise<Object> {
  try {
    let placeStockState = new StockState(this._id)
    let stockObject = await placeStockState.toObject()
    return stockObject
  } catch (err) {
    throw err
  }
}

export let PlaceModel = mongoose.model<Place>(modelName, PlaceSchema)
