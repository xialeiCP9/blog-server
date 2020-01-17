module.exports = app => {
  const mongoose = require('mongoose')

  mongoose.connect('mongodb://localhost:27017/blog', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const conn = mongoose.connection
  conn.on('connected', function() {
    console.log('数据库连接成功')
  })
}