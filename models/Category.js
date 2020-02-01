const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  'title': String,
  'parent': {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  'desc': String
}, {
  versionKey: false
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
