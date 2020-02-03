module.exports = (app) => {
  const router = require('express').Router({
    mergeParams: true //导入父级参数到子路由，如use中的resource，能够在get/delete/post/put获取到
  })
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
    const list = await req.Model.find({})
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

  app.use('/admin/api/rest/:resource', (req, res, next) => {//中间件，将categories变为Category
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
  app.post('/admin/api/upload',upload.single('file'), async (req, res) => {
    const file = req.file
    const extention = mime.getExtension(file.mimetype)
    await fs.rename(file.path, file.path + '.' + extention, (err) => {
      if (err) {
        console.log(err)
      }
    })
    file.url = 'http://localhost:3000/' + file.filename + '.' + extention
    file.filename = file.filename + '.' + extention
    file.path = file.path + '.' + extention
    gm(file.path).size((err, size) => {
      if (err) {
        console.log(err)
        res.send('err')
      }
      file.size = size
      res.send(file)
    })
  })
  //剪切图片
  app.post('/admin/api/cut', async (req, res) => {
    const {w, h, x, y, file} = req.body
    gm(file.path).crop(w, h, x, y).write(file.path, (err) => {
      if (err) {
        console.log(err)
        res.status(500)
      }
      res.send(file.url)
    })
  })
}
