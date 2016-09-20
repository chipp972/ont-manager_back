import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {Alert} from '../type/model.d.ts'
import {checkRef} from './utils'
import {ProductModel} from './product'
import {PlaceModel} from './place'

const modelName = 'Alert'

export let AlertSchema = new mongoose.Schema({
  danger: { default: 1, type: Number },
  description: String,
  placeId: { ref: 'Place', required: true, type: Number },
  productId: { ref: 'Product', type: Number },
  warning: { default: 1, type: Number }
})

// Plugins
AlertSchema.plugin(autoIncr.plugin, modelName)

// reference validation
checkRef(AlertSchema, 'productId', ProductModel)
checkRef(AlertSchema, 'placeId', PlaceModel)

// check if warning and danger positive
AlertSchema.path('warning').validate((value, next) => {
  next(value > 0)
}, 'Warning threshold inferior to 0')
AlertSchema.path('danger').validate((value, next) => {
  next(value > 0)
}, 'Danger threshold inferior to 0')

AlertSchema.methods.check = async function (): Promise<any> {
  let place = await PlaceModel.findById(this.placeId).exec()
  // TODO alert check
  // calculate stockstate then
  // check if for productId threshold is superior
}

export let AlertModel = mongoose.model<Alert>(modelName, AlertSchema)
