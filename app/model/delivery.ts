import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {OrderModel} from './order'
import {checkRef} from './utils'
import {StockSchema} from './stock'
import {Delivery} from '../type/model.d.ts'

const modelName = 'Delivery'

export let DeliverySchema = new mongoose.Schema({
  date: { required: true, type: Date },
  orderId: { ref: 'Order', required: true, type: Number },
  stock: [StockSchema]
})

// Plugins
DeliverySchema.plugin(autoIncr.plugin, modelName)

// reference validations
checkRef(DeliverySchema, 'orderId', OrderModel)

export let DeliveryModel = mongoose.model<Delivery>(modelName, DeliverySchema)
