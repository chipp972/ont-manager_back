import * as mongoose from 'mongoose'

let rightSchema = new mongoose.Schema({
  add: { default: true, type: Boolean },
  modify: { default: true, type: Boolean },
  view: { default: true, type: Boolean }
}, {_id: false})

let userSchema = new mongoose.Schema({
  login: { required: true, type: String },
  password: { required: true, type: String },
  right: rightSchema
}, { timestamps: true })

let typeSchema = new mongoose.Schema({
  name: { required: true, type: String }
})

let equipementSchema = new mongoose.Schema({
  model: { required: true, type: String },
  serial: { required: true, type: String },
  type: typeSchema,
  vendor: { required: true, type: String },
}, { timestamps: true })

export let User = mongoose.model('User', userSchema)
