/**
 * Contains the type informations about the database object returned
 */
import * as mongoose from 'mongoose'
import {LoggerInstance} from 'winston'

export interface ProductCode extends mongoose.Document {
  code: string
  description: string
  placeId: number
}

export interface Stock extends mongoose.Schema {
  codeId: number
  quantity: number
  unitPrice: number
  description?: string
}

export interface Attachment extends mongoose.Document {
  name: string
  contentType: string
  data: Buffer
  description?: string
  orderId: number
}

export interface Alert extends mongoose.Document {
  codeId: number
  placeId: number
  threshold: number
  description?: string
}

export interface Place extends mongoose.Document {
  name: string
  address?: string
  description?: string
  internalStock: boolean

  // methods
  getStockState: () => Promise<Object>
}

export interface User extends mongoose.Document {
  activated: boolean
  email: string
  password: string
  admin: boolean

  // methods
  comparePassword: (password: string) => Promise<boolean>
}

export interface Order extends mongoose.Document {
  date: Date
  placeIdSource: number
  placeIdDestination: number
  reference?: string
  stock?: Array<Stock>
  userId: number
  state: string
}

export interface Delivery extends mongoose.Document {
  date: Date,
  orderId: number,
  stock?: Array<Stock>
}

export interface DatabaseObject {
  connection: mongoose.Connection
  logger: LoggerInstance
  tokenSalt: string

  alert: mongoose.Model<Alert>
  attachment: mongoose.Model<Attachment>
  delivery: mongoose.Model<Delivery>
  order: mongoose.Model<Order>
  place: mongoose.Model<Place>
  product_code: mongoose.Model<ProductCode>
  user: mongoose.Model<User>
}
