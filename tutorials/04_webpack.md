# Webpack

Webpack is a module bundler for front-end technologies. It's an alternative to
using a complex gulpfile. So instead of making a complex gulpfile, you can set
up a complex webpack setup!

Gone are the days where you just make an html file, a css file, and a js file
and just connect them. It's an unfortunate side-effect of wanting to make things
more efficient at the same time that people want richer, interactive
online experiences.

Webpack has become one of the more popular build tools to compile react apps for
the web. It also has many good plugins that help you write modern javascript
that compiles to javascript that will work on a majority of browsers.

[Here][webpack] is the documentation for webpack. It's kind of hard to
understand the documentation if you don't already know how to setup webpack, so
we're going to make the simplest setup possible. Once you work through it, it
will make your development process much easier, especially as your app expands.

First, create a new directory in your project called `client/`. This is where
all of your client-side code will live. Create a new file called `entry.js` in
that `client/` directory. This file will be what includes all of the other files
in our project. For now, just put an `alert('hello world');` in that file. We'll
use that to verify that our webpack project is set up correctly.

Next, create a file in the root of your directory called `webpack.config.js`.
This will act as our configuration:

```js
var path = require('path');

module.exports = {
  entry: './client/entry.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [],
  module: {
    loaders: []
  }
};
```

Next, we need to install `webpack`:

```sh
npm install --save-dev webpack
```

Now let's add a build script to our package.json:

```js
{
  // ...
  "scripts": {
    "build": "webpack"
    // ...
  },
  // ...
}
```

You'll also want to change the `index.html` file to have the following contents:
(You may keep the contents, but either rename the old `index.html` or comment
out the other stuff we did in the last tutorial)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>React Todo App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="bundle.js"></script>
  </body>
</html>
```

Now we need to add the public folder to our server. Edit your `app.js` so that
it looks like this:

```js
'use strict';

import path from 'path';
import config from 'config';
import express from 'express';
import bodyParser from 'bodyParser';
import api from './routes';

const app = express();
const PORT = config.port;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(bodyParser.json());
app.use('/api', api);
app.use(express.static(PUBLIC_DIR));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

```

Now start your server, and go to http://localhost:8000. Notice how you'll
probably get a 404 error saying `bundle.js` is not defined. In another terminal
tab/window, run `npm run build`. Once it's done, refresh the page and you should
get an `alert` box saying 'hello world'. If you don't get that, then go through
the process again to make sure you you didn't miss anything.

Now let's try to get our Todo app up and running in this new system. Before we
start creating new files, we need to include a new webpack 'loader' that will
transpile our es6 into browser compatible JavaScript. Install a new package
called `babel-loader` in the devDependencies, and modify your
`webpack.config.js` to add the loader config:

```js
var path = require('path');

module.exports = {
  entry: './client/entry.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [],
  module: {
    loaders: [
      {
        test: /\.js$/, // Telling webpack to use files that match this pattern
        loader: 'babel', // Uses the module `babel-loader`
        exclude: /node_modules/, // Don't transpile modules in the `node_modules/` directory
        include: __dirname, // Include all other files
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};
```

In order to get `jsx` to work, we'll also need to install a babel preset plugin:

```sh
npm install --save-dev babel-preset-react
```

We've already included it in our `babel-loader` config in our
`webpack.config.js`.

Now try running `npm run build` and make sure everything still works.

Now we can convert our old React stuff into our new webpack setup.

Start by creating a new folder in the `client/` directory called `components/`.
This is where all of our React components will live. They will each get their
own file, and we'll include them using the `import/require` syntax.

Let's start with the `Todo` component `client/components/Todo.js`:

```js
import React from 'react';
// Even though we don't use React directly, the process to convert JSX into
// `React.createElement()` calls needs `React` available

const Todo = (props) => {
  var styles = {
    textDecoration: props.completed ? 'line-through' : 'none',
    cursor: 'pointer'
  };
  return (
    <span style={styles} onClick={() => props.onClick()}>{props.name}</span>
  );
};

export default Todo;
```

Next, let's get our `TodoList` component up `client/components/TodoList.js`:

```js
import React from 'react';
import Todo from './Todo'; // Import our Todo component that we just wrote.

const TodoList = (props) => {
  return (
    <ul>
      {
        props.todos.map((todo) => {
          return (
            <li key={todo.id}>
              <Todo
                name={todo.name}
                completed={todo.completed}
                onClick={() => props.onTodoClick(todo)}
              />
            </li>
          );
        })
      }
    </ul>
  );
};

export default TodoList;
```

Alright, let's get our `AddTodo` component written
`client/component/AddTodo.js`:

```js
import React, { Component } from 'react';

class AddTodo extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const input = this.refs.input;
    this.props.onSubmit(input.value);
    input.value = '';
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input ref="input" />
        <button>Add Todo</button>
      </form>
    );
  }

}

export default AddTodo;
```

And finally, our `App` component `client/components/App.js`:

```js
import React, { Component } from 'react';
import AddTodo from './AddTodo';
import TodoList from './TodoList';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = { todos: [], autoId: 1 };
    this.createTodo = this.createTodo.bind(this);
    this.toggleTodo = this.toggleTodo.bind(this);
  }

  createTodo(name) {
    this.setState({
      autoId: this.state.autoId + 1,
      todos: [
        ...this.state.todos,
        {
          id: this.state.autoId,
          name,
          completed: false
        }
      ]
    });
  }

  toggleTodo(todo) {
    const id = todo.id
    this.setState({
      todos: this.state.todos.map((todo) => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    });
  }

  render() {
    return (
      <div>
        <AddTodo onSubmit={this.createTodo} />
        <TodoList
          todos={this.state.todos}
          onTodoClick={this.toggleTodo}
        />
      </div>
    );
  }

}

export default App;
```

Before we hook anything anything up, we'll need to install our dependencies,
which are `react` and `react-dom`:

```sh
npm install --save-dev react react-dom
```

Now we can hook everything up in our `entry.js`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

Now that we've got our ducks in a row, try running `npm run build` again and
check it out in your browser. You're react 'app' should be running now.

Our setup can still be considered complex, but I promise that the more you use
it, the easier it will become to modify and optimize.

[webpack]: https://webpack.github.io/
