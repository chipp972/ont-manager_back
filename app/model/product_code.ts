import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

// import {checkRef} from './utils'
// import {CategoryModel} from './category'

const modelName = 'ProductCode'

export let ProductCodeSchema = new mongoose.Schema({
  categoryId: { ref: 'Category', type: Number },
  code: { required: true, type: String }
})

// Plugins
ProductCodeSchema.plugin(autoIncr.plugin, modelName)

// reference validation
// checkRef(ProductCodeSchema, 'categoryId', CategoryModel)
