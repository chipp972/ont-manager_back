import * as mongoose from 'mongoose'

export let SocietySchema = new mongoose.Schema({
  name: {
    index: { unique: true },
    lowercase: true,
    required: true,
    trim: true,
    type: String
  }
})

export let Society = mongoose.model('Society', SocietySchema)
