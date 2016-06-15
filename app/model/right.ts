import * as mongoose from 'mongoose'

export let RightSchema = new mongoose.Schema({
  add: { default: true, type: Boolean },
  modify: { default: true, type: Boolean },
  view: { default: true, type: Boolean }
}, { _id: false })

export let Right = mongoose.model('Right', RightSchema)
