import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {checkRef} from './utils'
import {Category} from './category'
import {Place} from './place'

const modelName = 'Alert'

export let AlertSchema = new mongoose.Schema({
  categoryId: { ref: 'Category', type: Number },
  description: String,
  placeId: { ref: 'Place', type: Number },
  threshold: { default: 1, type: Number }
})

// Plugins
AlertSchema.plugin(autoIncr.plugin, modelName)

// reference validation
checkRef(AlertSchema, 'categoryId', Category)
checkRef(AlertSchema, 'placeId', Place)

// check if threshold positive
AlertSchema.path('threshold').validate((value, next) => {
  next(value > 0)
}, 'Threshold inferior to 0')
