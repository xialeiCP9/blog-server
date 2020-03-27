const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const adminRouter = require('./routes/admin')

const app = express()
// 增加全局变量，用于设置token
app.set('secret', 'xialei')
/**
* 连接数据库
**/
require('./plugins')(app)
mongoose.set('useFindAndModify', false)

//解决跨域问题
app.use(require('cors')())

app.use(bodyParser.json())

adminRouter(app)

app.use(express.static(path.join(__dirname ,'uploads')))

app.listen(3000)