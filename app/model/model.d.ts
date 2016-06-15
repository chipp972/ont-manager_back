/**
 * Contains the type informations about the database object returned
 */

import * as mongoose from 'mongoose'

export interface DatabaseObject {
  connection: mongoose.Connection
  dsp: mongoose.Model<mongoose.Document>
  equipmentType: mongoose.Model<mongoose.Document>
  equipment: mongoose.Model<mongoose.Document>
  order: mongoose.Model<mongoose.Document>
  society: mongoose.Model<mongoose.Document>
  user: mongoose.Model<mongoose.Document>
}
