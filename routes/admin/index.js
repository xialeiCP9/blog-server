module.exports = (app) => {
  const router = require('express').Router()

  const User = require('../../models/User')
  const Category = require('../../models/Category')

  router.get('/', function(req, res) {
    res.send('admin-dashboard')
  })

  router.get('/articles', function(req,res) {
    res.send('admin-articles')
  })

  router.post('/category', (req, res) => {
    Category.create(req.body, (err, result) => {
      if(err) {
        console.log('错误', err)
        res.status(404)
      }
      res.send('success')
    })
  })

  router.get('/category', async (req, res) => {
    const list = await Category.find({})
    res.send(list)
  })

  router.delete('/category', (req, res) => {
    Category.deleteMany({'_id': {$in: req.body}}).then(resp => {
      res.send('success')
    }).catch(err => {
      console.log(err)
    })
  })

  router.put('/category/:id', (req, res) => {
    Category.findByIdAndUpdate(req.params.id, req.body.data).then(resp => {
      res.send('success')
    }).catch(err => {
      console.log(err)
    })
  })

  app.use('/admin', router)
}