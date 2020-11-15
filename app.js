const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookies = require('cookies');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api.js');
const authRouter = require('./routes/auth.js');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookies.express(['joshlol_88vnbwa9', 'joshlol_kmfdas78', 'joshlol_9873hjhk']));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/', express.static('uploads'));

app.use(function(err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);
   
  // handle CSRF token errors here
  res.status(403);
  res.send('form tampered with');
});

process.on('uncaughtException', err => console.error(err.stack, true));
process.on('unhandledRejection', err => console.error(err.stack, true));

module.exports = app;