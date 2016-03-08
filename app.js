
'use strict';

import express from 'express';
import config from 'config';
import bodyParser from 'body-parser';
import api from './routes';


const app = express();
const PORT = config.port;

app.use(bodyParser.json());
app.use('/api', api);

app.use((req, res, next) =>{
  console.log(`Request ${req.method} ${req.path}`);
  next();
})

app.get('/', (req, res, next) => {
  res.send('Hello World');
})

app.get('/json', (req, res, next) => {
  res.json({
    hello: "world",
    foo: "bar"
  })
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
