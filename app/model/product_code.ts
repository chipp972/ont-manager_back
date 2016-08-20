import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {ProductCode} from '../type/model.d.ts'
import {checkRef} from './utils'
import {CategoryModel} from './category'
import {PlaceModel} from './place'

const modelName = 'ProductCode'

export let ProductCodeSchema = new mongoose.Schema({
  categoryId: { ref: 'Category', type: Number },
  code: { index: { unique: true}, required: true, type: String },
  placeId: { ref: 'Place', type: Number }
})

// Plugins
ProductCodeSchema.plugin(autoIncr.plugin, modelName)

// reference validation
checkRef(ProductCodeSchema, 'categoryId', CategoryModel)
checkRef(ProductCodeSchema, 'placeId', PlaceModel)

export let ProductCodeModel =
  mongoose.model<ProductCode>(modelName, ProductCodeSchema)
