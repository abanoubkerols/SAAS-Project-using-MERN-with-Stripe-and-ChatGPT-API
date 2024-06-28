const express = require('express')
const  {register ,logOut,  userProfile, login, checkAuth}  = require('../controllers/userControl');
const isAuth = require('../middlewares/IsAuth');

const userRouter = express.Router()

userRouter.post('/register' , register)
userRouter.post('/login' , login)
userRouter.post('/logout' , logOut)
userRouter.get('/profile' ,isAuth ,userProfile)
userRouter.get('/auth/check' ,isAuth ,checkAuth)



module.exports = userRouter