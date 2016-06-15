import * as mongoose from 'mongoose'

export let EquipmentTypeSchema = new mongoose.Schema({
  name: { index: { unique: true}, required: true, type: String }
})

export let EquipmentType = mongoose.model('EquipementType', EquipmentTypeSchema)
