# Initialization

For this tutorial, we're going to set up some boilerplate code and directory
structure. It's important to make some of these decisions up front so that we
don't flip flop to much after we get going.

## `npm`

First thing's first, let's initialize our `package.json` with `npm init`

```sh
npm init
```

Follow the prompts to generate your `package.json`. Now we're ready to start
installing node modules.

If you're not planning on using babel on the server, then skip this babel
part and go down to where we install `express`.

I'm going to first install the babel modules we need to get started with that
on the server-side.

```sh
npm install --save babel-core babel-preset-es2015 babel-polyfill
```

The above installed 3 packages:

* `babel-core` - The core babel runtime. It doesn't make any code
  transformations by default. We need plugins that tie into babel's runtime
  code modification stuff.
* `babel-preset-es2015` - This is a babel preset, which contains many babel
  plugins to makes it so you can use a lot of es6 features now without Node
  providing it to you.
* `babel-polyfill` - This polyfills some of the es6 stuff that don't
  necessarily need to transform syntax. For example: Arrow functions (pre
  Node 4) were not supported with the syntax, but babel transforms Arrow
  functions in a way that make it so it works like the es6 spec. A polyfill
  is used for things like adding a new prototype method to Strings and Arrays,
  or a completely new data type like Promises.

In order for babel to know what presets/plugins to use, we must create an
additional file called `.babelrc`, which will act as our babel config. Put in
the following contents:

```json
{
  "presets": ["es2015"]
}
```

Note that we did not need to put `babel-preset-es2015` and instead we just put
`es2015`. When we put a string value into the `presets` array, it automatically
looks for packages that start with `babel-preset-`.

In order to use them now, we need to include them in our files. Create two
files called `app.js` and `init.js`. We'll use `init.js` to put in our babel
bootstrapping code.

```js
'use strict';

require('babel-core/register'); // This starts up the babel runtime parser
require('babel-polyfill'); // This provides the extra es6 items like Promises and Array methods
require('./app'); // Starts up the app be requiring our `index.js.

```

This app is just the gateway into our real code. This file cannot be running in
full babel compatible es6, but every file required from here on out will be,
which is why we `require('./app')`.

Now we need to start building our app. Let's install `express` and set up our
`app.js`.

```sh
npm install --save express
```

```js
'use strict';

import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

```

So remember that I'm using es6. I'm going to break this down to es5 this time,
but you'll need to keep up with the rest yourself:

* `import express from 'express'` => `var express = require('express')`
* `const app = express()` => replace `const` with `var`
* `const PORT = process.env.PORT || 8000` => replace `const` with `var`
* ``app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))`` =>
  `app.listen(PORT, function() => console.log('Server listening on port ' + PORT))`

As we've done before, all this is doing is initializing an empty express app.
Before we do anything deeper, let's organize ourselves with some directories to
help us make decisions on where to put things.

Create the following folders in your app:

* `config/` - This is where our app configuration will go. We'll talk more about
  this in a later tutorial.
* `lib/` - This is where most of our 'miscellaneous' modules will go. You may
  not need this folder, but it's good to have a place where those types of
  things go.
* `models/` - This is where our model definitions go. They will describe our
  database schemas and make it much easier to manage our data.
* `public/` - This is where our static front-end assets will live.
* `routes/` - This is where our api routes will go. We'll talk more about that
  in just a minute.

> **Protip:** `git` is only concerned with files, so you can't actually commit
  an empty directory. One way to get around this is to create an empty file in
  the directory you want to commit called `.gitkeep` (you can call it whatever
  you want, but that is a standard of naming that says, "I want to keep this
  folder in source control even though I don't have any content in it").

It's a good idea to also setup `npm start` to start up the correct file. In your
`package.json`, add a script called `start` that runs `node init`.

```js
{
  // ...
  "scripts": {
    "start": "node init"
  },
  // ...
}
```

Now when you run `npm start`, it will run `node init`, which will start up your
app. At this point, you should attempt to run `npm start` and make sure you get
the "Server listening" message in your console.

Now that you've got kind of a boilerplate set up, go ahead and commit your work
and push it up to github.

We need to now set up our configuration. Install the `config` module with
`npm install --save config`. Now in your `config/` directory, create a new file
called `default.js`. This will act as your default config.

```js
'use strict';

module.exports = {
  port: '8000'
};

```

Now in your `app.js` file, make the following changes:

```js
'use strict';

import config from 'config'; // This is the config module. It will read your `config/default.js`
import express from 'express';

const app = express();
const PORT = config.port; // Because we set the default port to 8000, it will pull in `8000`

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

```

> **Protip:** Notice how we also took out the `process.env.PORT || 8000`.
`process.env.PORT` pulls the environment variable from your shell process. You
can set environment variables for when you run scripts. like so:
```sh
PORT=3000 npm start
```
Then in your javascript, you can access it with this:
```js
console.log(process.env.PORT); // '3000'
```
In the new app.js file, we do not take environment variables into account
anymore, but the `config` module allows us to utilize them. Create a new file
in the `config/` folder called `custom-environment-variables.js`:
```js
'use strict'
module.exports = {
  port: 'PORT'
};
```
Now when you set the `PORT` environment variable, it will override the default
config.
