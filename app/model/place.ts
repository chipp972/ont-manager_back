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

// cascade delete of orders
PlaceSchema.pre('remove', function (next: Function): void {
  Order.remove({ placeIdSource: this._id }).exec()
  Order.remove({ placeIdDestination: this._id }).exec()
  next()
})

// method to find all stock from a place at a certain date
// put in the databaseObject ?
PlaceSchema['methods'].getStockState =
async function (ltdate?: Date, gtdate?: Date): Promise<any> {
  try {
    let place = this
    let outputOrder = await Order
      .find({
        date: { $lt: ltdate },
        placeIdSource: place._id
      }).exec()
    let inputOrder = await Order
      .find({
        date: { $lt: ltdate },
        placeIdDestination: place._id
      }).exec()
      // then...
  } catch (err) {
    return err
  }
}
