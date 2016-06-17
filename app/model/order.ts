import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {StockSchema} from './stock'
import {User} from './user'

const modelName = 'Order'

export let OrderSchema = new mongoose.Schema({
  date: { default: new Date(), type: Date },
  file: [{
    contentType: { required: true, type: String},
    data: { required: true, type: Buffer},
    description: String,
    name: { lowercase: true, required: true, trim: true, type: String}
  }],
  placeIdDestination: { ref: 'Place', type: Number },
  placeIdSource: { ref: 'Place', type: Number },
  reference: { index: { unique: true }, required: true, type: String },
  stock: [{ required: true, type: StockSchema }],
  userId: { ref: 'User', required: true, type: Number }
})

// validate userId
OrderSchema.path('userId').validate((value, respond) => {
  User.findOne({ _id: value }, (err, document) => {
    if (err || ! document) {
      respond(false)
    } else {
      respond(true)
    }
  })
}, `userId doesn\'t correspond to any document in User`)

OrderSchema.pre('save', function (next: Function): void {
  let order = this

  // validate there is at least placeIdSource or placeIdDestination
  if (! (order.placeIdSource || order.placeIdDestination)) {
    next(new Error('Need at least a source or a destination place'))
  } else {
    // validate stock
    // if dest only: no problem -> we get stocks from nowhere
    // if source only: no problem -> we put stock in prod
    // if source and dest problem -> stock transfer so we must verify each stock
    // exists and the quantity asked is lower or equal to the quantity
    // of the stock
    next()
  }
})

OrderSchema.plugin(autoIncr.plugin, modelName)
export let Order = mongoose.model('Order', OrderSchema)
