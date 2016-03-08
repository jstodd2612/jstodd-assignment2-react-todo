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
  Todo.create(req.body, (err, todo) => {
    if (err) return next(err);
    res.status(201).json(todo0;)
  });
});

export default todosRouter;
