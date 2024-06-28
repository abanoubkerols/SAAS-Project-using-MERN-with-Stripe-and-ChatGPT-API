const express = require('express')
require('dotenv').config()
const cors = require('cors')
const userRouter = require('./routes/userRouter')
require('./utils/connectDB')()
const { errorHandler } = require('./middlewares/errorMiddleware')
const cookieParser = require('cookie-parser')
const openAiRouter = require('./routes/openAiRoute')
const stripeRouter = require('./routes/stripeRoute')
const User = require('./models/User')
const cron = require('node-cron')
const app = express()

const corsOption = {
  origin :'http://localhost:3000',
  credentials : true,

}

app.use(cors(corsOption))

const port = process.env.PORT || 5000

cron.schedule('0 0 * * * *', async () => {
  console.log('running cron job')

  try {
    const today = new Date()
    await User.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: today }
      },
      {
        trialActive: false,
        subscriptionPlan: 'Free',
        monthlyRequestCount: 5
      }
    )
  } catch (error) {}
})

cron.schedule('0 0 1 * * *', async () => {
  console.log('running cron job')

  try {
    const today = new Date()
    await User.updateMany(
      {
        subscriptionPlan: 'Free',
        nextBillingDate: { $lt: today }
      },
      {
        monthlyRequestCount: 0
      }
    )
  } catch (error) {}
})


cron.schedule('0 0 1 * * *', async () => {
    console.log('running cron job')
  
    try {
      const today = new Date()
      await User.updateMany(
        {
          subscriptionPlan: 'Basic',
          nextBillingDate: { $lt: today }
        },
        {
          monthlyRequestCount: 0
        }
      )
    } catch (error) {}
  })
  


  
cron.schedule('0 0 1 * * *', async () => {
    console.log('running cron job')
  
    try {
      const today = new Date()
      await User.updateMany(
        {
          subscriptionPlan: 'Premium',
          nextBillingDate: { $lt: today }
        },
        {
          monthlyRequestCount: 0
        }
      )
    } catch (error) {}
  })
  

app.use(express.json())
app.use(cookieParser()) 


app.use('/api/v1/users', userRouter)
app.use('/api/v1/openai', openAiRouter)
app.use('/api/v1/stripe', stripeRouter)
app.use(errorHandler)
app.listen(port, () => console.log('Server running on port 5000'))
