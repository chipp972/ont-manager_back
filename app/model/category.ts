/**
 * List of sub categories of stock
 */
import * as mongoose from 'mongoose'
import * as autoIncr from 'mongoose-auto-increment'

const modelName = 'Category'

export let CategorySchema = new mongoose.Schema({
  description: String,
  name: {
    index: { unique: true },
    lowercase: true,
    required: true,
    trim: true,
    type: String
  },
  subCategoryId: [{ ref: 'Category', type: Number }]
})

// Plugins
CategorySchema.plugin(autoIncr.plugin, modelName)
export let Category = mongoose.model(modelName, CategorySchema)

// validate subCategoryId
CategorySchema.path('subCategoryId').validate((value, next) => {
  let promiseList = []
  for (let subcategory of value) {
    let p = Category.findOne({ _id: subcategory }).exec()
    .then((document) => {
      if (! document) {
        p.reject(new Error())
      } else {
        p.resolve()
      }
    }, err => p.reject(new Error()))
    promiseList.push(p)
  }
  Promise.all(promiseList)
  .then(() => next(true))
  .catch((err) => next(false))
}, 'subCategoryId doesn\'t correspond to any document in Category')

// cascade delete of stock in orders
// CategorySchema.pre('remove', function (next: Function): void {
//   Order.find()
//   Order.remove({ categoryId: this._id }).exec()
//   next()
// })
