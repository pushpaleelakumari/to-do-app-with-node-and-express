const express = require('express');
const fs = require("fs").promises

const app = express();
app.use(express.json())
let todos = []

const readFile = async () => {
    try {
        const data = await fs.readFile('./todos.json', 'utf-8');
        todos = JSON.parse(data)
    } catch (err) {
        console.log('not able to read file')
    }
}

const writeFile = async () => {
    try {
        const data = await fs.writeFile('./todos.json', JSON.stringify(todos), 'utf-8')
        // todos = JSON.parse(data)
    } catch (err) {
        console.log("not able to write the file")
    }
}

readFile()

app.get('/todos', (req, res) => {
    res.json(todos)
})

app.get('/todo/:id', (req, res) => {
    const todoId = parseInt(req.params.id)
    const todoIndex = todos.findIndex((x) => x.id === todoId)
    if (todoIndex !== -1)
        return res.json(todos[todoIndex])
    res.status(404).json({ message: 'Todo not found', status: "not found" })
})

app.put('/todo/:id', (req, res) => {
    const todoId = parseInt(req.params.id)
    const todoIndex = todos.findIndex((x) => x.id === todoId)
    if (todoIndex !== -1) {
        todos[todoIndex].text = req.body
        writeFile()
        return res.json(todos)
    }
    res.status(404).json({ status: "error", message: "todo not found" })
})

app.post('/todo', (req, res) => {
    let { text } = req.body
    if (!text) {
        return res.status(404).json({ status: "error", message: "please enter valid data" })
    }
    let newTodo = { id: todos.length + 1, text }
    todos.push(newTodo)
    writeFile()
    res.json(todos)
})

app.delete('/todo/:id', (req, res) => {
    const todoId = parseInt(req.params.id)
    todos = todos.filter((x) => x.id !== todoId)
    writeFile()
    res.json(todos)
})

app.listen(6000, () => {
    console.log('port is listening 6000')
})