# REST

`REST` stands for "Representational State Transfer". It's essentially a way to
communicate to a server via HTTP by telling it what action you would like to
take on a resource.

A resource is represented by a url. `http://example.com/users` is a resource.
`http://example.com/users/178489322` is a resource. When you request a resource,
the server responds by sending you data, in any number of formats. When you make
an HTTP request to that endpoint, it may return you a `json` encoded body, or
possibly and `xml` encoded body. Or it may respond with an error.

You can tell the server to do different things to any given resource by using
HTTP verbs. You can tell the server to retrieve a resource, update it, delete
it, or create new resources. The server doesn't just automatically adhere to
whatever request you give it, so you have to conform to what the server allows
you to do.

Some common HTTP verbs are as follows:

* `GET` This tells the server to read data. No data modifications should happen
  in this type of request.

* `POST` This tells the server to create a new resource.

* `PUT` This tells the server to update a resource

* `DELETE` This tells the server to delete a resource

So with any given resource url, you can use different HTTP verbs to tell the
server to do different things. For example:

If I `GET http://example.com/users`, I'm telling the server hosted at
`http://example.com` to fetch me the resource under the name `/users`. If I
change the verb to `POST`, I'm then telling the server that I want to create a
new `/users` resource. If that is successful, it may return some sort of user id
that I can use in subsequent requests. If it returned an id of `123`, I could
request `GET http://example.com/users/123` and it should retrieve the data for
the user resource who's id is `123`.

We've got the start of this from the [previous tutorial](./01_routes.md) in our
`routes/todos.js` file. Let's take another look:

```js
'use strict';

import express from 'express';

const { Router } = express;
const todosRouter = new Router();

const todos = [];

// Here we have a route that gets all of the todos
todosRouter.get('/', (req, res, next) => {
  res.json(todos);
});

export default todosRouter;

```

So if we wanted to add a route that could create a todo, we would want to use
the `POST` HTTP verb. Express allows us to easily intercept requests based on
HTTP verb. Add the following after your `todosRouter.get()` call:

```js
todosRouter.post('/', (req, res, next) => {
  todos.push(req.body);
  res.json(req.body);
});
```

Start your server again, and run the following `curl` command to test out your
new `POST` handler:

```
curl -X POST \
--header 'Content-Type: application/json' \
--header 'Accept: application/json' \
--data '{
  "name": "newTodo",
  "completed": false
}' \
http://localhost:8000/api/todos
```

First off, with the code that we've currently set up through this set of
tutorials, it should not print out anything. If you put some console.log
statements in the `todosRouter.post('/')` middleware, you'll find that
`req.body` is undefined. You most certainly sent a request body in that curl
request. Before we get into that, let's explain what this `curl` request is
doing.

This command is making a new HTTP request to `http://localhost:8000/api/todos`
with the `POST` verb, and two heads that specify:

1. The content type of the request body
2. What content type I'm expecting in the response

As mentioned earlier, this is all handled by the server, and it's up to the
server to respect these options.

So the problem with our server is that it is not parsing the request body and
putting the result in `req.body`. So we need to include some robust middleware
that will parse the json body for us.

```sh
npm install --save body-parser
```

`body-parser` is a battle-hardened express middleware module that parses various
forms of request body encoding types, including json, urlencoded, text, and a
few others.

To use it, let's include it in our `app.js`

```js
'use strict';

import config from 'express';
import express from 'express';
import bodyParser from 'bodyParser';
import api from './routes';

const app = express();
const PORT = config.port;

// Here's where the magic happens. Any middleware after this have access to
// `req.body` for those requests that come through as `json` bodies with the
// `Content-Type: application/json` header
app.use(bodyParser.json());
app.use('/api', api);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

```

Now if you restart your app and run the curl request from above again, you get
a response back! Right now you're not doing any validation on the data that
comes into the response. We need to verify that it has the right properties and
that they are the right data types so that we don't save bogus data.

Let's do some rudimentary data validation in our `POST` endpoint
(`/routes/todos.js`):

```js
todosRouter.post('/', (req, res, next) => {
  // If there is no name, then return an error to the next callback
  if (!req.body.name) {
    return next(new Error('You must include a `name` in the body'));
  }
  // If the name property is not a string, return an error
  if (typeof req.body.name !== 'string') {
    return next(new Error('The `name` property must be a string'));
  }

  let newTodoId = todos.push({
    name: req.body.name,
    completed: false,
  });

  res.json(todos[newTodoId]);
});
```

In the above, it checks to make sure the `name` property is sent along, and that
it is a string. We send some informative error messages if either of those
checks fail. Then if those checks pass, then we add the new todo to the array
with the `completed` field set to false.

This is a pretty rudimentary todo api which only allows you to retrieve and
create new todos. Below is a simple Todo class to store todos in memory. Note
that this will just be used for testing purposes and should not be used in
production. Every time the server restarts, it will clear your todo data. It
provides you with basic `CRUD` functionality. `CRUD` stands for `Create`,
`Read`, `Update`, `Delete`.

```js
'use strict';

// These are the valid keys for creating a new todo
const VALID_KEYS = new Set([ 'name', 'completed' ]);
// This will be where the todos are stored
const todos = [];
// This will be our quick todo lookup
const idIndex = {};
// This is the id that gets incremented every time we create a new todo
let autoId = 1;

class Todo {

  // creates a new todo
  constructor(newTodo) {
    // Reduces the passed in todo object to just the valid properties so that we
    // don't override any prototype methods.
    newTodo = Object.keys(newTodo).reduce((todo, key) => {
      if (VALID_KEYS.has(key)) todo[key] = newTodo[key];
      return todo;
    }, {});

    Object.assign(this, {
      completed: false,
      name: '',
    }, newTodo);
  }

  // Saves the newly created todo in the "database"
  save(callback) {
    Todo.validate(this, (err, data) => {
      if (err) return callback(err);

      // ids should always be strings because we're not doing math on it.
      const id = String(autoId++);

      // set the id
      data.id = id;
      // "save" the data into the index and the array. They are just pointing
      // to the memory used so if you change the todo in one place, it will
      // change it in both.
      idIndex[id] = data;
      todos.push(data);

      callback(null, data);
    });
  }

  // Finds all of the todos
  static find(callback) {
    callback(null, todos);
  }

  // Finds a single todo by id
  static findOne(id, callback) {
    callback(null, idIndex[id]);
  }

  // Creates a new todo and saves it to the database
  static create(newTodo, callback) {
    let todo = new Todo(newTodo);
    todo.save(callback);
  }

  // Updates a todo by id
  static update(id, updateTodo, callback) {
    Todo.findOne(id, (err, todo) => {
      if (err) return callback(err);
      if (!todo) return callback(new Error('todo not found with given id'));

      // This allows us to do partial updates, so you can send just the
      // "completed" field without sending the "name"
      let updatedTodo = Object.assign({}, todo, updateTodo);

      // Validate that the newly updated todo has valid data
      Todo.validate(updatedTodo, (err, data) => {
        if (err) return callback(err);

        // Update the todo
        Object.assign(idIndex[id], {
          name: updatedTodo.name,
          completed: updatedTodo.completed,
        });

        callback(null, idIndex[id]);
      });
    });
  }

  // Deletes a todo by id
  static delete(id, callback) {
    Todo.findOne(id, (err, todo) => {
      if (err) return callback(err);
      if (!todo) return callback(new Error('todo not found with given id'));

      // Find the index of the todo in the list
      const foundIndex = todos.findIndex((todo) => todo.id === id);

      // If for some reason we can't find it, return an error
      if (foundIndex === -1) {
        return callback(new Error('error finding id in list of todos'));
      }

      // Remove the document from all locations
      delete idIndex[id];
      delete todos[foundIndex];

      callback(null, id);
    });
  }

  // Validates todo data to make sure
  static validate(data, callback) {
    // Check that the name is a string
    if (typeof data.name !== 'string') {
      return callback(new Error('todo name must be a string'));
    }
    // Check that completed is a boolean
    if (typeof data.completed !== 'boolean') {
      return callback(new Error('todo completed must be a boolean'));
    }

    callback(null, {
      name: data.name,
      completed: data.completed,
    });
  }

}

module.exports = Todo;

```

I would highly recommend you read the above code and attempt to understand it.
It's not super important to understand everything above for this tutorial as we
will be replacing it with our mongoose data models. If you haven't already,
create a folder at the root of your project folder called `lib/`, and place the
above contents into a file called `todo.js`.

This file will provide the functionality necessary to make hooking it up to your
api a breeze. The below examples show you how you can use the above module.

```js
// Creates a new Todo (but doesn't save it)
let todo = new Todo({
  name: 'Implement Todo class'
});

// Saves a new todo
todo.save((err, newTodo) => {
  if (err) return console.error(err);
  console.log(newTodo);
});

// Creates and saves a new todo
Todo.create({
  name: 'Implement Todo class',
  completed: true,
}, (err, newTodo) => {
  if (err) return console.error(err);
  console.log(newTodo);
});

// Find all Todos
Todo.find((err, todos) => {
  if (err) return console.error(err);
  console.log(todos);
});

// Find a single todo by id
Todo.findOne('1', (err, todo) => {
  if (err) return console.error(err);
  console.log(todo);
});

// Update a todo
Todo.update('1', { completed: true }, (err, todo) => {
  if (err) return console.error(err);
  console.log(todo);
});

// Delete a todo
Todo.delete('1', (err) => {
  if (err) return console.error(err);
  // Todo with the id of '1' is now deleted
});
```

Now that we have our Todo module, let's include it in our todo routes file
`routes/todos.js`:

```js
'use strict';

import express from 'express';
import Todo from '../lib/todo';

const { Router } = express;
const todosRouter = new Router();

// GET /api/todos
// Retrieves all todos
todosRouter.get('/', (req, res, next) => {
  Todo.find((err, todos) => {
    if (err) return next(err);
    res.json(todos);
  });
});

// POST /api/todos
// Creates a new todo. Example body:
// {
//   "name": "{todo name}",
//   "completed": false
// }
todosRouter.post('/', (req, res, next) => {
  Todo.create(req.body, (err, todo) => {
    if (err) return next(err);
    // We set the status to 201 to follow rest guidelines. 201 means "Created"
    res.status(201).json(todo);
  });
});

// GET /api/todos/:id
// Retrieves a single todo
todosRouter.get('/:id', (req, res, next) => {
  Todo.findOne(req.params.id, (err, todo) => {
    if (err) return next(err);
    res.json(todo);
  });
});

// PUT /api/todos/:id
// Updates a todo
// {
//   "name": "{updated name}",
//   "completed": true
// }
todosRouter.put('/:id', (req, res, next) => {
  Todo.update(req.params.id, req.body, (err, todo) => {
    if (err) return next(err);
    res.json(todo);
  });
});

// DELETE /api/todos/:id
// Deletes a todo
todosRouter.delete('/:id', (req, res, next) => {
  Todo.delete(req.params.id, (err) => {
    if (err) return next(err);
    // We just a status 204 to mean "No Content".
    res.sendStatus(204);
  });
});

export default todosRouter;

```

The updates we just made to the routes file complete the `CRUD` services. We are
now able to create, read, update, and delete todo items via HTTP requests.

Before we hook it up to a real database, let's work on some front-end pieces.
In the next tutorial, we will set up React.
