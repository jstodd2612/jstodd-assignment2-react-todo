# Routes

In the [previous tutorial](./init.md), we set up a boilerplate application with
a basic directory structure. We're going to talk about modularized routing using
express routers.

In your `routes/` directory, create a new file called `index.js`. This is where
we're going to organize our api routes.

```js
'use strict';

import express from 'express';

const { Router } = express; // remember destructuring?
const api = new Router();



export default api;

```

Express provides a way of creating a stripped down express app, which doesn't
have methods like `.listen()` and other server starting things. An express
router does let you set up api endpoints. You have access to all of the methods
like `.use()`, `.get()`, `.post()`, and all the other middleware mounting
methods. The router itself is middleware that you mount onto your app or other
routers.

The empty space between the `const api` and `export default` lines is for you
to fill in with with your routes.

Since this is a todo app, let's create a new file called `todos.js` in the
`routes/` directory and start it out with this content:

```js
'use strict';

import express from 'express';

const { Router } = express;
const todosRouter = new Router();

const todos = [];

todosRouter.get('/', (req, res, next) => {
  res.json(todos);
});

export default todosRouter;

```

This is a simple router that has one route: `/`. When you make a `GET` request
to that route, it returns a json response with the value of todos.

Let's go back to our `routes/index.js` and add the following:

```js
'use strict';

import express from 'express';
import todos from './todos'; // Import our todosRouter

const { Router } = express;
const api = new Router();

api.use('/todos', todos); // Mount the todosRouter to the route /todos

export default api;

```

Now your `api` router has a new route that routes `/todos` to the `todosRouter`
router.

Before we can actually hit that endpoint from the browser, we need to mount it
onto our app in `app.js`. You're app.js should look something like this now:

> **Protip** If you import or `require()` a folder, it will look to see if an
  `index.js` file exists in that folder. So if you `require('./routes')`, it's
  the same as `require('./routes/index')`.

```js
'use strict';

import config from 'config';
import express from 'express';
import api from './routes'; // This is our root api route.

const app = express();
const PORT = config.port;

// Here's where we set up our middleware
app.use('/api', api);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

```

After that, try going to your browser at http://localhost:8000/api/todos. You
should get an empty array `[]`. You could also use a command-line tool called
`curl` to get the values you want:

```sh
curl -i https://localhost:8000/api/todos
```

You should get some output that shows all of the HTTP headers as well as the
response body, which should be the value of your `todos` variable in your
`routes/todos.js` file.

In your `routes/todos.js` file, try adding things into that array and restarting
the app to see if it changes.

> **Protip** If you're making lots of changes to your api, you're probably going
  to get really sick of having to `ctrl` + `c` your app and start it up again
  over an over. You're not alone! Open Source to the rescue! There are several
  npm modules that restart your app whenever one of your files changes. The one
  I would recommend for local development would be `nodemon`.
>
> To get started with nodemon, install it as a dev dependency in your project:
  ```sh
  npm install --save-dev nodemon
  ```
  Add the a script to run the dev version of your app
  ```js
{
  // ...
  "scripts": {
    "start": "node init",
    "dev": "nodemon init"
  }
}
  ```
  Now when you run `npm run dev`, it will start up your server, and then listen
  for file changes. Try saving one of your files like `routes/todos.js` after
  you've started your server with `npm run dev`. Note that it logged out the
  "Server listening" message again. You can restart the server manually by
  typing in `rs` and pressing enter into the terminal while nodemon is running,
  or you can quit by the normal `ctrl` + `c` method.

After you've got everything working, you should save your work, commit, and push
your changes up to github.
