import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {checkRef} from './utils'
import {CategoryModel} from './category'

const modelName = 'Stock'

export let StockSchema = new mongoose.Schema({
  categoryId: { ref: 'Category', type: Number },
  description: String,
  quantity: { default: 1, type: Number },
  unitPrice: { default: 0, type: Number }
})

// Plugins
StockSchema.plugin(autoIncr.plugin, modelName)

// reference validation
checkRef(StockSchema, 'categoryId', CategoryModel)
