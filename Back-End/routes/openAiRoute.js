const express = require('express')

const isAuth = require('../middlewares/IsAuth')
const {openAiControl} = require('../controllers/openAiControl')
const checkApiReqestLimit = require('../middlewares/checkApiRequestLimit')

const openAiRouter = express.Router()

openAiRouter.post('/generate' ,  isAuth , checkApiReqestLimit, openAiControl)


module.exports = openAiRouter