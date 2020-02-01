const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  'email': String,
  'phone': String,
  'pwd': String,
  'nickname': String,
  'avatar': {type: String, default: 'http://localhost:3000/avatar-default.jpg'},
  'type': String
}, {
  versionKey: false
})

const User = mongoose.model('User', userSchema)

module.exports = User
