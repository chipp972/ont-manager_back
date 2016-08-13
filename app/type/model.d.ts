/**
 * Contains the type informations about the database object returned
 */
import * as mongoose from 'mongoose'
import {LoggerInstance} from 'winston'

export interface Category extends mongoose.Document {
  name: string
  description?: string
  upperCategoryId?: number
}

export interface ProductCode extends mongoose.Schema {
  code: string
  categoryId: number
}

export interface Stock extends mongoose.Schema {
  categoryId: number
  quantity: number
  unitPrice: number
  description?: string
}

export interface File extends mongoose.Schema {
  name: string
  contentType: string
  data: Buffer
  description?: string
}

export interface Place extends mongoose.Document {
  name: string
  address?: string
  description?: string
  internalStock: boolean
  productCodeList: Array<ProductCode>
}

export interface Alert extends mongoose.Schema {
  categoryId: number
  placeId: number
  threshold: number
  description?: string
}

export interface User extends mongoose.Document {
  activated: boolean
  email: string
  password: string
  admin: boolean
  alertList?: Array<Alert>
  comparePassword:
  (password: string, cb: (err: Error, isMatch: boolean) => any) => any
}

export interface Order extends mongoose.Document {
  date: Date
  deliveryDate?: Date
  receivedStock?: Array<Stock>
  file?: Array<File>,
  placeIdSource: number
  placeIdDestination: number
  reference?: string
  stock?: Array<Stock>
  userId: number
  reservation: boolean
}

export interface DatabaseObject {
  connection: mongoose.Connection
  logger: LoggerInstance
  tokenSalt: string
  category: mongoose.Model<Category>
  order: mongoose.Model<Order>
  place: mongoose.Model<Place>
  user: mongoose.Model<User>
}
