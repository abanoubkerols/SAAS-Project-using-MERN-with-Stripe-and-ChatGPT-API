const asyncHanler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const isAuth = asyncHanler(async (req, res, next) => {
  if (req.cookies.token) {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded?.id).select('-password')
    return next()

  } else {
    return res.status(401).json({ message: 'Not auth no Token' })
  }
})

module.exports = isAuth
