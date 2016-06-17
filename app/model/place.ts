/**
 * places where the stocks are
 */
import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {Company} from './company'
import {Order} from './order'

const modelName = 'Place'

export let PlaceSchema = new mongoose.Schema({
  address: String,
  companyId: { ref: 'Company', type: Number },
  description: String,
  name: {
    index: { unique: true },
    lowercase: true,
    required: true,
    trim: true,
    type: String
  }
})

// validate companyId
PlaceSchema.path('companyId').validate((value, respond) => {
  Company.findOne({ _id: value }, (err, document) => {
    if (err || ! document) {
      respond(false)
    } else {
      respond(true)
    }
  })
}, `companyId doesn\'t correspond to any document in Company`)

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
        date: { $gt: gtdate, $lt: ltdate },
        placeIdSource: place._id,
        select: { stock: 1 }
      })
    let inputOrder = await Order
      .find({
        date: { $gt: gtdate, $lt: ltdate },
        placeIdDestination: place._id,
        select: { stock: 1 }
      })
    // then ??
  } catch (err) {
    return err
  }
}

PlaceSchema.plugin(autoIncr.plugin, modelName)
export let Place = mongoose.model(modelName, PlaceSchema)
