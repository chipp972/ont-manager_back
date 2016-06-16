import {model, Schema} from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

const modelName = 'Company'

export let CompanySchema = new Schema({
  detail: { type: String },
  name: {
    index: { unique: true },
    required: true,
    trim: true,
    type: String
  }
})

CompanySchema.plugin(autoIncr.plugin, modelName)

export let Company = model(modelName, CompanySchema)
