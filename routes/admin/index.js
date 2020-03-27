module.exports = (app) => {
  const router = require('express').Router({
    mergeParams: true //导入父级参数到子路由，如use中的resource，能够在get/delete/post/put获取到
  })
  require('express-async-errors') // express不能捕获Promise异常搞了个破解包，因此需该包
  const jwt = require('jsonwebtoken')
  const User = require('../../models/User')
  const assert = require('http-assert')
  const authMiddleware = require('../../middleware/auth')
  /**
  * 通用CRUD接口
  **/
  router.post('/', (req, res) => {
    req.Model.create(req.body, (err, result) => {
      if(err) {
        console.log('错误', err)
        res.status(404)
      }
      res.send('success')
    })
  })

  router.get('/', async (req, res) => {
    const limit = parseInt(req.params.limit)
    const page = parseInt(req.params.page)
    const list = await req.Model.find({}).skip(page * limit).limit(limit)
    res.send(list)
  })

  router.delete('/', (req, res) => {
    req.Model.deleteMany({'_id': {$in: req.body}}).then(resp => {
      res.send('success')
    }).catch(err => {
      console.log(err)
    })
  })

  router.put('/:id', (req, res) => {
    req.Model.findByIdAndUpdate(req.params.id, req.body).then(resp => {
      res.send('success')
    }).catch(err => {
      console.log(err)
    })
  })

  /*// 登录校验中间件
  const authMiddleware = async (req, res, next) => {
    //前端通常用大小开头Authorization，后端用小写开头 authorization
    const token = String(req.headers.authorization || '').split(' ').pop()
    // token 为空时，报错
    assert(token, 401, '请先登录')
    const { _id } = jwt.verify(token, app.get('secret'))
    assert(_id, 401, '请先登录')
    // 通过_id 获取用户
    req.user = await User.findById(_id)
    assert(req.user, 401, '请先登录')
    next()
  }*/

  app.use('/admin/api/rest/:resource', authMiddleware(), (req, res, next) => {//中间件，将categories变为Category
    const modelName = require('inflection').classify(req.params.resource)
    req.Model = require(`../../models/${modelName}`)
    next()
  }, router)

  //上传图片
  const multer = require('multer')
  const fs = require('fs')
  const mime = require('mime')
  const upload = multer({dest: __dirname + '/../../uploads'})
  const gm = require('gm')
  // 上传图片
  app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
    const file = req.file
    const extention = mime.getExtension(file.mimetype)
    // 更细图片名称
    await fs.rename(file.path, file.path + '.' + extention, (err) => {
      if (err) {
        console.log(err)
        return res.status(500).send({
          message: '服务器出错'
        })
      }
    })
    file.url = 'http://localhost:3000/' + file.filename + '.' + extention
    file.filename = file.filename + '.' + extention
    file.path = file.path + '.' + extention
    // 获取图片尺寸
    gm(file.path).size((err, size) => {
      if (err) {
        console.log(err)
        return res.status(500).send({
          message: '服务器出错'
        })
      }
      file.size = size
      return res.send(file)
    })
  })
  //剪切图片
  app.post('/admin/api/cut', authMiddleware(), async (req, res) => {
    const {w, h, x, y, file} = req.body
    gm(file.path).crop(w, h, x, y).write(file.path, (err) => {
      if (err) {
        console.log(err)
        return res.status(500).send({
          message: '服务器出错'
        })
      }
      return res.send(file.url)
    })
  })
  //登录
  app.post('/admin/api/login', async (req, res) => {
    const { mode } = req.body 
    let user = null
    let isValid = false
    if (mode === 'password') {
      const { username } = req.body
      //用户名密码登录,查找用户
      user = await User.findOne({
        $or:[{nickname: username}, {email: username}]
      }).select('+password')
    } else {
      const { phone, code } = req.body
      user = await User.findOne({phone})
    }
    //用户不存在时
    assert(user, 422, '用户名不存在')
    /*if (!user) {
      return res.status(422).send({
        message: '用户不存在'
      })
    }*/
    // 用户存在，则比较密码是否正确
    if (mode === 'password') {
      const { password } = req.body
      isValid = require('bcrypt').compareSync(password, user.password)
    } else {
      //接收手机号返回值
      const { code } = req.body
      isValid = code === '123'
    }
    //密码不正确
    assert(isValid, 422, '用户名或密码错误')
    /*if (!isValid) {
      return res.status(422).send({
        message: '用户名或密码错误'
      })
    }*/
    // 返回token
    const token = jwt.sign({_id: user._id}, app.get('secret'))
    return res.send({token})
  })
  //错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.status || 500).send({
      message: err.message
    })
  })
}
