module.exports = (app) => {
  const router = require('express').Router()

  const User = require('../../models/User')

  router.get('/', function(req, res) {
    res.send('admin-dashboard')
  })

  router.get('/articles', function(req,res) {
    res.send('admin-articles')
  })

  router.get('/userinfo', function(req,res) {
    const user = new User({
      email: '2278769715qq.com',
      phone: '14545676788',
      pwd: '21321',
      nickname: 'dd',
      avatar: 'http://local',
      type: '000'
    })
    user.save(function(err){
      console.log(err)
    })
  })

  app.use('/admin', router)
}