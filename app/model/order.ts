import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {StockSchema} from './stock'

const modelName = 'Order'

export let OrderSchema = new mongoose.Schema({
  companyId: { ref: 'Company', type: Number },
  date: { default: Date.now, type: Date },
  file: [{
    contentType: { required: true, type: String},
    data: { required: true, type: Buffer},
    description: String,
    name: { required: true, type: String}
  }],
  placeIdDestination: { ref: 'Place', required: true, type: Number },
  placeIdSource: { ref: 'Place', type: Number },
  reference: { index: { unique: true }, required: true, type: String },
  stock: [StockSchema],
  userId: { ref: 'User', required: true, type: Number }
})

OrderSchema.plugin(autoIncr.plugin, modelName)
export let Order = mongoose.model('Order', OrderSchema)

// method to find all stock from a place at a certain date
