const express = require('express')
const { create } = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
const routes = require('./routes/index')

const app = express()
const exphbs = new create({defaultLayout: 'main', extname: '.hbs'})
const PORT = 3000

app.engine('hbs', exphbs.engine)
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(routes)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})