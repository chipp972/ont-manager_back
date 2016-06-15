import * as mongoose from 'mongoose'
import {EquipmentTypeSchema} from './equipment_type'

export let equipmentSchema = new mongoose.Schema({
  model: { required: true, type: String },
  serial: { required: true, type: String },
  state: {
    default: 'stock',
    enum: ['covage-stock', 'dsp-stock', 'production'],
    type: String
  },
  type: {
    ref: EquipmentTypeSchema,
    required: true,
    type: mongoose.Schema.Types.ObjectId
  },
  vendor: { required: true, type: String }
})

export let Equipment = mongoose.model('Equipment', equipmentSchema)
