/**
 * Utility functions for mongoose models
 */
import * as mongoose from 'mongoose'

/**
 * Check if an id reference is actually referencing a document in a collection
 * @param {mongoose.Schema}                   schema  the schema to add the
 *                                                    validation
 * @param {string}                            idField the name of the field
 * @param {mongoose.Model<mongoose.Document>} model   the model object
 */
export function checkRef (schema: mongoose.Schema, idField: string,
model: mongoose.Model<mongoose.Document>): void {
  schema.path(idField).validate((value, next) => {
    model.findById(value).exec()
    .then((document) => {
      if (!document) {
        next(false)
      } else {
        next(true)
      }
    }, err => next(err))
  }, `${idField} doesn\'t correspond to any document in ${model}`)
}
