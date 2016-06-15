import * as mongoose from 'mongoose'
import {DspSchema} from './dsp'
import {SocietySchema} from './society'

export let OrderSchema = new mongoose.Schema({
  date: { default: Date.now, type: Date },
  deliveryAddress: { require: true, type: String },
  dsp: {
    ref: DspSchema,
    type: mongoose.Schema.Types.ObjectId
  },
  flux: {
    default: 'in',
    enum: ['in', 'out'],
    type: String
  },
  purchaseOrderReference: { index: { unique: true }, type: String },
  society: {
    ref: SocietySchema,
    type: mongoose.Schema.Types.ObjectId
  }
})

export let Order = mongoose.model('Order', OrderSchema)
