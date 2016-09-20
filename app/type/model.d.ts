/**
 * Contains the type informations about the database object returned
 */
import * as mongoose from 'mongoose'
import {LoggerInstance} from 'winston'

export interface Product extends mongoose.Document {
  code: string
  description: string
  fileId?: number
}

export interface Stock extends mongoose.Document {
  orderId?: number
  deliveryId?: number
  productId: number
  quantity: number
  unitPrice: number
  description?: string
}

export interface Attachment extends mongoose.Document {
  name: string
  contentType: string
  data: Buffer
  description?: string
}

export interface Alert extends mongoose.Document {
  productId: number
  placeId: number
  warning: number
  danger: number
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
  placeList?: Array<number> // only if admin

  // methods
  comparePassword: (password: string) => Promise<boolean>
}

export interface Order extends mongoose.Document {
  date: Date
  placeIdSource: number
  placeIdDestination: number
  reference?: string
  userId: number
  state: string
  fileId?: number
}

export interface Delivery extends mongoose.Document {
  date: Date
  orderId: number
  fileId?: number
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
  product: mongoose.Model<Product>
  stock: mongoose.Model<Stock>
  user: mongoose.Model<User>
}
