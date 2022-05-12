const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);
  if(!user) {
    return response.status(400).json({ error: 'user not found!' });
  }
  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;
  const usernameAlreadyExists = users.some((user) => user.username === username );
  if(usernameAlreadyExists) {
    return response.status(400).json({ error: 'username already exists!' })
  }
  const userData = { id: uuidv4(), name, username, todos: [] }
  users.push(userData);
  return response.status(201).json(userData);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { deadline, title } = request.body;
  const { user } = request;
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  const id = request.params.id;

  const findToDo = user.todos.find((todo) => todo.id === id );

  if(!findToDo) {
    return response.status(400).json({ error: 'todo not found!' });
  }

  const editedToDo = {
    ...findToDo,
    title,
    deadline: new Date(deadline),
  }

  const newList = user.todos.map((todo) => {
    const newToDos = [];
    if(todo.id === editedToDo.id) {
      newToDos.push(editedToDo);
    } else {newToDos.push(todo);}
    return newToDos;
  });

  console.log(editedToDo);

  user.todos = newList;

  return response.status(201).json(user.todos);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

// app.listen(3333);

module.exports = app;