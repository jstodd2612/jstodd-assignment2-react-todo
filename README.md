# React Todo

For this assignment, I want you to build a todo web app. Features I would like
you to include:

* Be able to create/update/delete todo items. Todos must have a name and some
  sort of "completed" property to mark todo items as completed.

* Your back end should implement a REST API in order to interact with your
  database. I would recommend using `express` as your node web framework for
  building that API.

* Todo items must be persisted between app restarts. You should us a database
  to keep track of todo items. I would suggest using mongodb with `mongoose`
  as your data layer, but you may choose an alternative.

* Your front end should be made up of React Components. You should have
  *at least* 3 types of components: One for the todo list, one for each todo,
  and 1 for the form to create todos. If you're doing it right, you should end
  up with more than 3, but bare minimum is 3 components.

* Your interface should be clean and easy to use. It should be mobile accessible
  and performant. You should not have to do any page refreshes to update data.

* I expect some level of polish. Up until this point, we've been focusing on
  functionality. I want you to build something you're truly proud of, and able
  to show off to friends, family, and potential employers (or current employers
  if you're looking for a raise).

Just to be clear, you do not need the following:

* You don't need to write in ES6. That's just an FYI, but know that if you don't
  keep up, you'll be outdated pretty quickly. ES6 is already standard and
  implemented at least partially on most every JavaScript environment.

* You don't need to make it really complex. Sure, it might be cool to add
  tagging, extra descriptions, grouping, archiving, or other cool features to
  your todo app, but I'm not holding you to it.

* You don't need to worry about supporting IE10 and below, but I do expect some
  level of cross-browser testing. I will test it in various modern browsers.

* You don't need to implement a multi-user system. However, if you do want to
  implement one, it will be available for you to work on as extra credit.

You may fork this repository if you wish, but I would suggest you build this
app from scratch. I want you guys to start developing your own opinions for how
apps should be structured. I will offer some of the things that I've learned and
some common conventions, but ultimately, I want you to decide.

When I go through the tutorials, I will be leveraging es6 and babel. As
mentioned above, you don't need to do this, but know that I will not be doing
the same work in both es5 and es6.

# Table of Contents

1. [init](./tutorials/00_init.md)
1. [routes](./tutorials/01_routes.md)
1. [rest](./tutorials/02_rest.md)
1. [react](./tutorials/03_react.md)
1. [webpack](.tutorials/04_webpack.md)
1. redux
1. mongoose
