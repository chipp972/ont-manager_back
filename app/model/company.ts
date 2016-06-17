import {model, Schema} from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'
import {Place} from './place'

const modelName = 'Company'

export let CompanySchema = new Schema({
  description: String,
  name: {
    index: { unique: true },
    required: true,
    trim: true,
    type: String
  }
})

// cascade delete of places
CompanySchema.pre('remove', function (next: Function): void {
  Place.remove({ companyId: this._id }).exec()
  next()
})

CompanySchema.plugin(autoIncr.plugin, modelName)
export let Company = model(modelName, CompanySchema)
