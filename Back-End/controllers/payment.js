const asyncHanler = require('express-async-handler')
const calculateNextBillingDate = require('../utils/calculateNextBillingDate')
const { renewSubPlan } = require('../utils/renewSubPlan')
const Payment = require('../models/Payment')
const User = require('../models/User')
const stripe = require('stripe')(process.env.STRIPE_KEY)

const handlePayment = asyncHanler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body

  const user = req?.user
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: 'usd',
      metadata: {
        userId: user?._id?.toString(),
        userEmail: user.email,
        subscriptionPlan
      }
    })

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata
    })
  } catch (error) {
    res.status(500).json({ error })
  }
})

const verifyPayment = asyncHanler(async (req, res) => {
  const { paymentId } = req.params
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId)
    if (paymentIntent.status !== 'succeeded') {
      const metaData = paymentIntent?.metadata
      const subscriptionPlan = metaData?.subscriptionPlan
      const userEmail = metaData?.userEmail
      const userId = metaData?.userId

      const userFound = await User.findById(userId)
      if (!userFound) {
        return res.status(404).json({
          status: 'false',
          message: 'User not found'
        })
      }

      const amount = paymentIntent?.amount / 100
      const currency = paymentIntent?.currency
      const paymentId = paymentIntent?.id

      const newPayment = await Payment.create({
        user: userId,
        email: userEmail,
        subscriptionPlan,
        amount,
        currency,
        status: 'success',
        reference: paymentId
      })

      if (subscriptionPlan == 'Basic') {
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan :'Basic' ,
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 50,
          $addToSet: { payment: newPayment?._id }
        })
        res.json({
          status: 'true',
          message: 'payment verified , user updated',
          updatedUser
        })
      }

      if (subscriptionPlan == 'Premium') {
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan:'Premium',
          trialPeriod: 0,
          nextBillingDate: calculateNextBillingDate(),
          apiRequestCount: 0,
          monthlyRequestCount: 100,
          $addToSet: { payment: newPayment?._id }
        })
        res.json({
          status: 'true',
          message: 'payment verified , user updated',
          updatedUser
        })
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error })
  }
})

const handleFreeSub = asyncHanler(async (req, res) => {
  const user = req?.user

  calculateNextBillingDate()

  try {
    if (renewSubPlan(user)) {
      user.subscriptionPlan = 'Free'
      user.monthlyRequestCount = 5
      user.apiRequestCount = 0
      user.nextBillingDate = calculateNextBillingDate()

      const newPayment = await Payment.create({
        user: user?._id,
        subscriptionPlan: 'Free',
        amount: 0,
        status: 'success',
        reference: Math.random().toString(36).substring(7),
        monthlyRequestCount: 0,
        currency: 'usd'
      })
      user.payment.push(newPayment?._id)
      await user.save()
      res.json({
        status: 'success',
        message: 'subscription plan updated successfully ',
        user
      })
    } else {
      return res.status(403).json({ error: 'sub renwal not due yet' })
    }
  } catch (error) {
    res.status(500).json({ error })
  }
})

module.exports = { handlePayment, handleFreeSub, verifyPayment }
