const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

const verifyifUserExists = (request, response, next) => {
  const { username } = request.headers;
  const user = users.some((user) => user.username === username);
  if(!user) {
    return response.status(400).json({ error: 'user not found!' });
  }
  request.user = user;
  return next();
};

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
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
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.listen(3333);

module.exports = app;