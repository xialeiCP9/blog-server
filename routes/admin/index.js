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
  app.post('/admin/api/upload',upload.single('file'), (req, res) => {
    const file = req.file
    const extention = mime.getExtension(file.mimetype)
    fs.rename(file.path, file.path + '.' + extention, (err) => {
      if(err)
        console.log(err)
      file.url = 'http://localhost:3000/' + file.filename + '.' + extention
      res.send(req.file)
    })
  })
}