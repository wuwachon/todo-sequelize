const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

// create a new todo
router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/', async (req, res) => {
  const name = req.body.name
  const UserId = req.user.id
  await Todo.create({ name, UserId })
  res.redirect('/')
})

// read detail of a todo
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const todo = await Todo.findByPk(id)
    res.render('detail', { todo: todo.toJSON() })
  } catch(err) {
    console.log(err)
  }
})
// update and edit a todo
router.get('/:id/edit', async (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  const todo = await Todo.findOne({ where: {id, UserId} })
  res.render('edit', {todo: todo.toJSON()})
})
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  const { name, isDone } = req.body
  const todo = await Todo.findOne({ where: {id, UserId}})
  todo.name = name
  todo.isDone = isDone
  await todo.save()
  res.redirect(`/todos/${id}`)
})
// delete a todo
router.delete('/:id', async (req, res) => {
  const id = req.params.id
  const UserId = req.user.id
  const todo = await Todo.findOne({ where: {id, UserId} })
  await todo.destroy()
  res.redirect('/')
})

module.exports = router