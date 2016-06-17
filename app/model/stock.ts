import * as mongoose from 'mongoose'
import {Category} from './category'
import {SubCategory} from './sub_category'

export let StockSchema = new mongoose.Schema({
  categoryId: { ref: 'Category', type: Number },
  description: String,
  quantity: { default: 1, type: Number },
  subCategoryId: { ref: 'SubCategory', type: Number },
  unitPrice: { default: 0, type: Number }
})

// check categoryId and subCategoryId consistency
StockSchema.pre('save', function (next: Function): void {
  let stock = this
  if (stock.categoryId && ! stock.subCategoryId) {
    Category.findOne({ _id: stock.categoryId }, (err, document) => {
      if (err || ! document) {
        let msg = 'categoryId doesn\'t correspond to any document in Category'
        next(new Error(msg))
      } else {
        next()
      }
    })
  } else if (stock.subCategoryId) {
    SubCategory.findOne({ _id: stock.subCategoryId })
    .populate('categoryId')
    .exec((err, document) => {
      if (err || ! document) {
        let msg = 'subCategoryId doesn\'t correspond'
                + 'to any document in SubCategory'
        next(new Error(msg))
      } else {
        stock.categoryId = document.get('categoryId._id')
        console.log(document.get('categoryId._id'))
        next()
      }
    })
  } else {
    next(new Error('no category specified'))
  }
})
