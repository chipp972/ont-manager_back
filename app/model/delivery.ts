import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

import {OrderModel} from './order'
import {AttachmentModel} from './attachment'
import {checkRef} from './utils'
import {Delivery} from '../type/model.d.ts'

const modelName = 'Delivery'

export let DeliverySchema = new mongoose.Schema({
  date: { required: true, type: Date },
  fileId: { ref: 'Attachment', type: Number },
  orderId: { ref: 'Order', required: true, type: Number }
})

// Plugins
DeliverySchema.plugin(autoIncr.plugin, modelName)

// reference validations
checkRef(DeliverySchema, 'orderId', OrderModel)
checkRef(DeliverySchema, 'fileId', AttachmentModel)

// check if delivery is partial
// DeliverySchema.post('save', (delivery) => {
// })

export let DeliveryModel = mongoose.model<Delivery>(modelName, DeliverySchema)
