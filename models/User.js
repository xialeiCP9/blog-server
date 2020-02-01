const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  'email': String,
  'phone': String,
  'pwd': String,
  'nickname': String,
  'avatar': String,
  'type': String
}, {
  versionKey: false
})

const User = mongoose.model('User', userSchema)

module.exports = User
