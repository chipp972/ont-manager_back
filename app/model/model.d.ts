/**
 * Contains the type informations about the database object returned
 */

import * as mongoose from 'mongoose'

export interface DatabaseObject {
   connection: mongoose.Connection
   user: mongoose.Model<mongoose.Document>
}
