import * as mongoose from 'mongoose'

export let DspSchema = new mongoose.Schema({
  name: {
    index: { unique: true },
    lowercase: true,
    required: true,
    trim: true,
    type: String
  }
})

export let Dsp = mongoose.model('Dsp', DspSchema)
