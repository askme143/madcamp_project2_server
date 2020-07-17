const express = require('express');
const app = express();

/* External modules */
const logger = require('morgan');
const bodyParser = require('body-parser');

/* My modules */
const apiUser = require('./routes/api/user');

/* Put functions in the middleware */
/* logger */
app.use(logger('dev'));

/* Body parser */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* My modules */
// app.post('/login', apiUser.checkUser);
app.post('/signup', apiUser.signUpUser);
app.get('/login', apiUser.checkUser);

module.exports = app;