const asyncHanler = require('express-async-handler')
const User = require('../models/User')

const checkApiReqestLimit = asyncHanler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not Auth' })
  }

  const user = await User.findById(req.user.id)
  if (!user) {
    return res.status(404).json({ message: 'Not found' })
  }

  let requestLimit = 0

  if (user.trialActive) {
    requestLimit = user?.monthlyRequestCount
  }

  if (user?.apiRequestCount >= requestLimit) {
    throw new Error('Api Request limit reached Plz Subscribe to A plane')
  }

  next()
})

module.exports = checkApiReqestLimit
