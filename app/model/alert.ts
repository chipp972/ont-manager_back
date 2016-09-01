import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {Alert} from '../type/model.d.ts'
import {checkRef} from './utils'
import {CategoryModel} from './category'
import {PlaceModel} from './place'

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
checkRef(AlertSchema, 'categoryId', CategoryModel)
checkRef(AlertSchema, 'placeId', PlaceModel)

// check if threshold positive
AlertSchema.path('threshold').validate((value, next) => {
  next(value > 0)
}, 'Threshold inferior to 0')

AlertSchema.methods.check =
async function (): Promise<any> {
  PlaceModel.findById(this.placeId).exec()
  .then()
  // calculate stockstate then
  // check if for categoryId threshold is superior
}

export let AlertModel = mongoose.model<Alert>(modelName, AlertSchema)
