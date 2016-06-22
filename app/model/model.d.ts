/**
 * Contains the type informations about the database object returned
 */
import * as mongoose from 'mongoose'

export interface DatabaseObject {
  connection: mongoose.Connection
  category: mongoose.Model<mongoose.Document>
  order: mongoose.Model<mongoose.Document>
  place: mongoose.Model<mongoose.Document>
  user: mongoose.Model<mongoose.Document>
}

export interface Category {
  _id: number
  name: string
  description?: string
  subCategoryId?: Array<number>
}

export interface Stock {
  _id: number
  categoryId: number
  quantity: number
  unitPrice: number
  description?: string
}

export interface File {
  name: string
  contentType: string
  data: Buffer
  description?: string
}

export interface Place {
  _id: number
  name: string
  address?: string
  description?: string
  internalStock: boolean
}

export interface User {
  _id: number
  mail: string
  password: string
  admin: boolean
}

export interface Order {
  _id: number
  date: Date
  file?: Array<File>,
  placeIdSource: number
  placeIdDestination: number
  reference?: string
  stock: Array<Stock>
  userId: number
  reservation: boolean
}
