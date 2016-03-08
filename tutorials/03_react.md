# React

There are a soooo many convoluted examples of how to do react including complex
build process and tools. All of that baggage and leave people who are learning
react with a sour taste in their mouths.

For this tutorial, we're going to stick to one file. A simple html file with all
of our libraries loaded via a cdn so we don't have to worry about build
processes. This setup is not ideal for production as load times for large
complex apps will be unacceptable. It is also outdated and will no longer be
supported. We will do it the right way, but right now it's more important that
you learn the concepts of React.

Create a new folder called `public/`, and place a new file called `index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>React Todo App</title>
    <script src="https://fb.me/react-0.14.7.min.js"></script>
    <script src="https://fb.me/react-dom-0.14.7.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      ReactDOM.render(
        <h1>Hello World</h1>,
        document.getElementById('root')
      );
    </script>
  </body>
</html>
```

Now open up that `index.html` file in the browser.

Let's take a look at this piece by piece:

- We include 3 difference libraries:
  - **react** - The react library
  - **react-dom** - The react dom library that renders react components to
    the browser DOM. React, by itself, is not tied to the browser, so they split
    out the DOM specific pieces into it's own library.
  - **babel-core/browser** - This is the babel renderer that will transform es6
    and jsx into browser compatible javascript. Note that this library is
    deprecated. We're only using it for quick prototyping and understanding the
    concepts of React

- We have a script tag in the body.

  Note that the `type` attribute is set to `text/babel`. This is only needed
  because of how we're transpiling es6 to es5 in the browser directly. When we
  set up a normal build process, we will not need to worry about this piece.

- Everything in that `<script>` tag can be written in es6 and
  jsx.

- `ReactDOM.render()` takes in two arguments:
  1. A React element. It can have nested elements, but you must only have one
    root element
  2. A DOM element to mount your React component to. You just use the built in
    browser methods like `document.getElementById`. Just make sure you have an
    element on the page with the given id.

# JSX

Before we go any deeper, we should explain `JSX`. [Here's][jsx] a good primer on
what `JSX` is. We'll summarize:

> JSX is a JavaScript syntax extension that looks similar to XML.

```js
var myDivElement = <div className="foo" />;
ReactDOM.render(myDivElement, document.getElementById('example'));
```

When used with React and a transpiler (like babel), it turns JSX into
Javascript. The previous example would be turned into the following code:

```js
var myDivElement = React.createElement(
  'div', // This is the type of html element, or it could be a custom component
  { className: 'foo' } // This represents the attributes of the component
);
ReactDOM.render(myDivElement, document.getElementById('example'));
```

It allows you to represent tree-like structures that can be rendered into html.
You can nest elements just like you would in html:

```js
var myForm = (
  <form>
    <label>
      First Name:
      <input type="text" />
    </label>
    <label>
      Last Name:
      <input type="text" />
    </label>
  </form>
);

ReactDOM.render(myForm, document.getElementById('example'));
```

The previous example gets turned into this:

```js
var myForm = React.createElement('form', null,
  React.createElement('label', null,
    'First Name:',
    React.createElement('input', { type: 'text' })
  ),
  React.createElement('label', null,
    'Last Name:',
    React.createElement('input', { type: 'text' })
  )
);
ReactDOM.render(myForm, document.getElementById('example'));
```

So you can write react without writing in jsx or needing that extra transpile
step, but it's much more verbose and harder to read. Almost all react tutorials
will favor JSX instead of plain JavaScript.

You can also pass in variables and things into props and text areas:

```js
var todo = {
  name: 'completed tutorial',
  completed: false
};
var todoStyles = {
  textDecoration: todo.completed ? 'line-through' : 'none'
};
var clickHandler = () => console.log('todo clicked!');

var todoDiv = (
  <div>
    <span style={todoStyles} onClick={clickHandler}>{todo.name}</span>
  </div>
);

ReactDOM.render(todoDiv, document.getElementById('example'));
```

The resulting html structure would look something like this:

```html
<div id="example">
  <div>
    <span style="text-transform: none" onclick="console.log('todo clicked!')">completed tutorial</span>
  </div>
</div>
```

If you want to repeat items, you can do it in JavaScript:

```js
var todos = [
  { id: '1', name: 'graduate', completed: false },
  { id: '2', name: 'get a job', completed: true },
  { id: '3', name: 'buy a house', completed: false }
];

var todos = (
  <ul>
    {
      todos.map((todo) => {
        var todoStyles = {
          textDecoration: todo.completed ? 'line-through' : 'none'
        };
        // You have to use a `key` property in order for react to track it
        return (
          <li key={todo.id}>
            <span style={todoStyles}>{todo.name}</span>
          </li>
        )
      })
    }
  </ul>
);
ReactDOM.render(todos, document.getElementById('example'));
```

The resulting html structure would look something like this:

```html
<div id="example">
  <ul>
    <li key="1">
      <span style="text-transform: none">graduate</span>
    </li>
    <li key="2">
      <span style="text-transform: line-through">get a job</span>
    </li>
    <li key="3">
      <span style="text-transform: none">buy a house</span>
    </li>
  </ul>
</div>
```

# React Components

React components provide an interface to build interactive HTML elements. It can
be easy at first to build your entire application in a single React component,
but the bigger components are much harder to isolate and reuse. React Components
should ideally follow the Unix-philosophy:

> Do one thing and do it well

Following this philosophy in code makes it more maintainable, reusable, and
modifiable. You should strive for this goal when writing React components. This
will make them each more testable and reusable.

The idea of building a React based application is to build a top level component
that composes smaller components. You should build it in a "tree" like fashion
with all components are only concerned with their "child" components. Components
should not be concerned with their parent components, only about their inputs
and outputs.

Let's look at a React component in it's simplest form: a function:

```js
const Todo = (props) => {
  var styles = {
    textDecoration: props.completed ? 'line-through' : 'none',
    cursor: 'pointer'
  };
  return (
    <span style={styles} onClick={() => props.onClick()}>{props.name}</span>
  );
};
```

This Todo component takes in props, and renders a dynamic, reusable todo item.
It takes in three different properties: `completed`, `name`, and `onClick`. You
can gather that by all of the ways we access the `props` variable inside of the
component function.

This should be pretty simple to read: A todo component will have a line through
the text if the `completed` property is true. The text it displays will be the
`name` property, and if a parent component cares if the todo item is clicked, it
will pass through an `onClick` function property.

Here's how you could render a Todo item:

```js
ReactDOM.render(
  <Todo
    name="Learn React"
    completed={false}
    onClick={() => console.log('Todo clicked!')}
  />,
  document.getElementById('example')
);
```

Here's how a `TodoList` component might look like:

```js
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
```

The `TodoList` component uses the `Todo` component inside of it, but it also
doesn't care about the application state. It just takes in the todo items,
renders each of them, then calls it's own `onTodoClick()` when a todo items is
clicked. Notice how we're passing the properties that the `Todo` component uses
as attributes. You can pass in string values like this: `prop="value"`, but if
you're passing in a variable, you need to use curly braces around the variable
you're passing as a property.

There are two other highly used ways of creating React components. One way is
using React's `.createClass()` syntax. Let's our `AddTodo` form in that syntax:

```js
const AddTodo = React.createClass({
  handleSubmit(e) {
    e.preventDefault(); // Prevents actual form submission
    const input = this.refs.input;
    this.props.onSubmit(input.value);
    input.value = '';
  },

  // This is the function that gets called when it renders the component, kind
  // of like our function components above. Instead of taking in the props as
  // an argument, you have access to the props in `this.props`.
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input ref="input" />
        <button>Add Todo</button>
      </form>
    );
  }
});
```

You can also use the es6 `class` syntax to write a component. This is how you
could write the above component:

```js
class AddTodo extends React.Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const input = this.refs.input;
    this.props.onSubmit(input.value);
    input.value = '';
  }
  render() {
    let input;
    return (
      <form onSubmit={this.handleSubmit}>
        <input ref="input" />
        <button>Add Todo</button>
      </form>
    );
  }
}
```

Alright, we've build all the children components that we need, but now we need
to have our container component that stores the state of the application and
actually handles creating new todos. In addition to using props, you can use
state. State has a very specific use case, and should be used sparingly. A
majority of your components should just use properties to manage how they are
displayed. This will be important when we get into using redux.

For our case, we will use state in our top-level `App` component. Let's take a
look at what it might look like using the `createClass()` syntax:

```js
const App = React.createClass({
  // This sets our initial `this.state` object
  getInitialState() {
    return { todos: [], autoId: 1 };
  },

  // We can call `this.createTodo('some name')` and it will add it to the state.
  // Not that we need to call `this.setState({})` in order for the state changes
  // to reflect on the page. This is the way we tell react "You should rerender
  // the component because we changed something".
  //
  // In this function, we increment the autoId (so that each todo item has a
  // unique id), and add the new todo. Notice I'm using the spread (`...`)
  // operator. I'm essentially creating a new array that has all of the old todo
  // items, then just add a new one onto the end of the newly created array.
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
  },

  // The toggleTodo method takes in a todo's id, and set's the new state. It
  // maps through all of the todos, and modifies the one todo whose id matched
  // the one given, and toggles the completed property.
  toggleTodo(todo) {
    const id = todo.id;
    this.setState({
      todos: this.state.todos.map((todo) => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    });
  },

  // Here we just utilize the components we've built. On the `<AddTodo />`'s
  // component `onSubmit()` handler with the new name, and pass it to the
  // `App` component's `this.createTodo()` handler.
  //
  // Same with the todos list. We pass down the todos we have in our state, and
  // we handle the TodoList's `onTodoClick()` handler, which is the `Todo`
  // component's `onClick()` handler.
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
});
```

Here's the same App component in es6 `class` syntax. Note that instead of the
`getInitialState()` method that we use the `constructor()` function with the
`super()` function. This is how es6 `class` inheritance works.

```js
class App extends React.Component {
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
    const id = todo.id;
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
```

All together now:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>React Todo App</title>
    <script src="https://fb.me/react-0.14.7.min.js"></script>
    <script src="https://fb.me/react-dom-0.14.7.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.23/browser.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      const Todo = (props) => {
        var styles = {
          textDecoration: props.completed ? 'line-through' : 'none'
        };
        return (
          <span style={styles} onClick={() => props.onClick()}>{props.name}</span>
        );
      };

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

      const AddTodo = React.createClass({
        handleSubmit(e) {
          e.preventDefault();
          const input = this.refs.input;
          this.props.onSubmit(input.value);
          input.value = '';
        },

        render() {
          return (
            <form onSubmit={this.handleSubmit}>
              <input ref="input" />
              <button>Add Todo</button>
            </form>
          );
        }
      });

      const App = React.createClass({

        getInitialState() {
          return { todos: [], autoId: 1 };
        },

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
        },

        toggleTodo(todo) {
          const id = todo.id;
          this.setState({
            todos: this.state.todos.map((todo) => {
              if (todo.id === id) {
                todo.completed = !todo.completed;
              }
              return todo;
            })
          });
        },

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
      });

      ReactDOM.render(
        <App />,
        document.getElementById('root')
      );
    </script>
  </body>
</html>
```

[jsx]: http://facebook.github.io/react/docs/jsx-in-depth.html
