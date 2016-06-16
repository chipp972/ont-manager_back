import * as mongoose from 'mongoose'

export let StockSchema = new mongoose.Schema({
  categoryId: { ref: 'Category', required: true, type: Number },
  quantity: { default: 1, type: Number },
  sub_categoryId: { ref: 'SubCategory', type: Number }
})
