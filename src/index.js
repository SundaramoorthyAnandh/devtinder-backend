const express = require('express');
const connect2Db = require('./config/db.config');
const cookieParser = require('cookie-parser');
const {
  authRouter,
  profileRouter,
  usersRouter,
  requestRouter,
} = require('./routes');

const app = express();

// Middleware to parse JSON body which converts JSON to JS object
// Chaining cookie parser
app.use([express.json(), cookieParser()]);

app.use('/', authRouter, profileRouter, usersRouter, requestRouter);

connect2Db()
  .then(() => {
    console.log('Connected to DB successfully');

    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch((err) => console.error(err));
