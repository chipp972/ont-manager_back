/**
 * Contains the type informations about the database object returned
 */
import * as mongoose from 'mongoose'

export interface DatabaseObject {
  connection: mongoose.Connection
  category: mongoose.Model<mongoose.Document>
  company: mongoose.Model<mongoose.Document>
  order: mongoose.Model<mongoose.Document>
  place: mongoose.Model<mongoose.Document>
  sub_category: mongoose.Model<mongoose.Document>
  user: mongoose.Model<mongoose.Document>
}

export interface Category {
  _id: number
  name: string
  description?: string
}

export interface SubCategory {
  _id: number
  name: string
  categoryId: number
  description?: string
}

export interface Stock {
  categoryId: number
  subCategoryId?: number
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

export interface Company {
  _id: number
  name: string
  description?: string
}

export interface Place {
  _id: number
  name: string
  companyId?: number
  address?: string
  description?: string
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
  placeIdSource?: number
  placeIdDestination: number
  reference: string
  stock: Array<Stock>
  userId: number
}
