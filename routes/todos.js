'use strict';

import express from 'express';

const { Router } = express;
const todosRouter = new Router();

const todos = [{
  title: 'Finish Tutuorial',
  completed: false
}];

todosRouter.get('/', (req, res, next) => {
  res.json(todos);
});

todosRouter.post('/', (req,res,next) => {
  let newTodoId = todos.push
})

export default todosRouter;
