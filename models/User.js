const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  'email': String,
  'phone': String,
  'pwd': String,
  'nickname': String,
  'avatar': String,
  'type': String
})

const User = mongoose.model('user', userSchema)

module.exports = User