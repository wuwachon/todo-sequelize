const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/', async (req, res) => {
  try {
    const todos = await Todo.findAll({
      raw: true,
      nest: true
    })
    res.render('index', { todos: todos })
  } catch(err) {
    res.status(422).json(error)
  }
})

module.exports = router