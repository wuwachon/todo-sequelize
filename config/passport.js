const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ where: {email} })
      if (!user) return done(null, false, req.flash('faillogin_msg', 'The email is not registered!'))
      const isMatch = bcrypt.compareSync(password, user.password)
      if (!isMatch) return done(null, false, req.flash('faillogin_msg', 'Email or Password incorrect.'))
      return done(null, user)
    } catch(err) {
      done(err, false)
    }
  }))
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { name, email } = profile._json
      const userFind = await User.findOne({ where: {email} })
      if (userFind) return done(null, userFind)
      const randomPassword = Math.random().toString(36).slice(-8)
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(randomPassword, salt)
      const user = await User.create({ name, email, password: hash})
      return done(null, user)
    } catch(err) {
      return done(err, false)
    }
  }))
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    profileFields: ['email', 'displayName']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const { name, email } = profile._json
      const userFind = await User.findOne({ where: {email} })
      if (userFind) return done(null, userFind)
      const randomPassword = Math.random().toString(36).slice(-8)
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(randomPassword, salt)
      const user = await User.create({ name, email, password: hash})
      return done(null, user)
    } catch(err) {
      return done(err, false)
    }
  }))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id)
      done(null, user.toJSON())
    } catch(err) {
      done(err, false)
    }
  })
}