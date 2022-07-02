const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const users = require('./modules/users')
const todos = require('./modules/todos')
const auth = require('./modules/auth')

router.use('/', home)
router.use('/users', users)
router.use('/todos', todos)
router.use('/auth', auth)

module.exports = router