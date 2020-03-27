//登录校验中间件
module.exports = options => {
  return async (req, res, next) => {
    const jwt = require('jsonwebtoken')
    const User = require('../models/User')
    const assert = require('http-assert')
    //前端通常用大小开头Authorization，后端用小写开头 authorization
    const token = String(req.headers.authorization || '').split(' ').pop()
    // token 为空时，报错
    assert(token, 401, '请先登录')
    const { _id } = jwt.verify(token, req.app.get('secret'))
    assert(_id, 401, '请先登录')
    // 通过_id 获取用户
    req.user = await User.findById(_id)
    console.log(req.user)
    assert(req.user, 401, '请先登录')
    next()
  }
}