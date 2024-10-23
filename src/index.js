const express = require('express');
const connect2Db = require('./config/db.config');
const cookieParser = require('cookie-parser');
const {
    authRouter,
    profileRouter,
    userRouter,
    requestRouter,
    feedRouter,
} = require('./routes');
const dotenv = require('dotenv');
dotenv.config();
const process = require('node:process');

const app = express();

// Middleware to parse JSON body which converts JSON to JS object
// Chaining cookie parser
app.use([express.json(), cookieParser()]);

app.use('/', authRouter, profileRouter, userRouter, requestRouter, feedRouter);

connect2Db()
    .then(() => {
        console.log('Connected to DB successfully');

        app.listen(process.env.PORT, () => {
            console.log(`Server listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => console.error(err));
