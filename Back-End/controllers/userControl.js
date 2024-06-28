const bcrypt = require('bcrypt')
const asyncHanler = require('express-async-handler')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const register = asyncHanler(async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      res.status(400)
      throw new Error('Please fill all the fields')
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email }) // Provide the query object
    if (userExists) {
      res.status(400)
      throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create a new user
    const user = new User({
      username,
      password: hashedPassword,
      email
    })
    user.trialExpires = new Date(
      new Date().getTime() + user.trialPeriod * 24 * 60 * 60 * 1000
    )
    await user.save()

    res.json({
      status: true,
      message: 'register',
      user: {
        username,
        email
      }
    })
  } catch (error) {
    throw new Error(error)
  }
})

const login = asyncHanler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    res.status(401)
    throw new Error('Invalid credentials')
  }

  const isMatch = await bcrypt.compare(password, user?.password)

  if (!isMatch) {
    res.status(401)
    throw new Error('Invalid credentials')
  }

  const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
    expiresIn: '3d'
  })
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3 * 24 * 60 * 60 * 1000
  })

  res.json({
    status: true,
    message: 'login',
    user: {
      username: user?.username,
      email: user?.email
    },
    _id: user?._id
  })
})

const logOut = asyncHanler(async (req, res) => {
  res.cookie('token', '', { maxAge: 1 })
  res.status(200).json({ message: 'Logged out successfully' })
})

const userProfile = asyncHanler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password')
    .populate('payment')
    .populate('contentHistory')
  if (user) {
    res.json({
      status: true,
      message: 'user profile',
      user
    })
  } else {
    res.status(404)
    throw new Error('not found')
  }
})

const checkAuth = asyncHanler(async (req, res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
  if (decoded) {
    res.json({
      isAuthenticated: true
    })
  } else {
    res.json({
      isAuthenticated: false
    })
  }
})

module.exports = {
  register,
  login,
  logOut,
  userProfile,
  checkAuth
}
