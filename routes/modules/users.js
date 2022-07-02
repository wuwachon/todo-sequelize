const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()
const db = require('../../models')
const User = db.User

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const user = await User.findOne({ where: {email} })
    if (user) {
      console.log('User already exist')
      return res.render('register', {name, email, password, confirmPassword})
    }
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    await User.create({ name, email, password: hash })
    res.redirect('/')
  } catch(err) {
    console.log(err)
  }
})

router.get('/logout', (req, res) => {
  res.send('logout')
})

module.exports = router