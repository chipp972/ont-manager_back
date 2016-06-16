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
  subCategory: mongoose.Model<mongoose.Document>
  user: mongoose.Model<mongoose.Document>
}

export interface Category {
  _id: number
  name: string
}

export interface SubCategory {
  _id: number
  name: string
  categoryId: number
}

export interface Stock {
  categoryId: number
  subCategoryId?: number
  quantity: number
}

export interface File {
  contentType: string
  data: Buffer
  description?: string
  name: string
}

export interface Company {
  _id: number
  name: string
  detail: string
}

export interface Order {
  _id: number
  name: string
  companyId: number
  date: Date
  file: Array<File>,
  placeIdSource: number
  placeIdDestination: number
  reference: string
  stock: Array<Stock>
  userId: number
}

export interface Place {
  _id: number
  name: string
  address?: string
  detail?: string
  currentStock?: Array<Stock>
}

export interface User {
  _id: number
  mail: string
  password: string
  admin: boolean
}
