const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id
    const todos = await Todo.findAll({
      raw: true,
      nest: true,
      where: { userId }
    })
    res.render('index', { todos: todos })
  } catch(err) {
    res.status(422).json(error)
  }
})

module.exports = router