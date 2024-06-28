const express = require('express')

const isAuth = require('../middlewares/IsAuth')

const {handlePayment ,handleFreeSub, verifyPayment} = require('../controllers/payment')

const stripeRouter = express.Router()

stripeRouter.post('/checkout' ,  isAuth , handlePayment)
stripeRouter.post('/freeplan' ,  isAuth , handleFreeSub)
stripeRouter.post('/verifypayment/:paymentId' ,isAuth ,verifyPayment)

module.exports = stripeRouter