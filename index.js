const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const adminRouter = require('./routes/admin')

const app = express()
/**
* 连接数据库
**/
require('./plugins')(app)
mongoose.set('useFindAndModify', false)

//解决跨域问题
app.use(require('cors')())

app.use(bodyParser.json())

adminRouter(app)

app.use(express.static(path.join(__dirname ,'upload')))

app.listen(3000)