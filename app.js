const express = require('express')
const { create } = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const routes = require('./routes/index')
const usePassport = require('./config/passport')
if (process.env.Node_Env !== 'production') require('dotenv').config()

const app = express()
const exphbs = new create({defaultLayout: 'main', extname: '.hbs'})
const PORT = 3000

app.engine('hbs', exphbs.engine)
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))
usePassport(app)

app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.faillogin_msg = req.flash('faillogin_msg')
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})