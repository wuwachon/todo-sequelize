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
    const errors = []
    if (!name || !email || !password || !confirmPassword) errors.push({message: 'All fields are required!'})
    if (password !== confirmPassword) errors.push({message: 'Password does not match the ConfirmPassword you entered.'})
    if (errors.length) return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
    const user = await User.findOne({ where: {email} })
    if (user) {
      errors.push({message: 'User already exist'})
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
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
  req.logout(err => {
    if(err) return next(err)
    req.flash('success_msg', 'Logout successfully!')
    res.redirect('/users/login')
  })
})

module.exports = router