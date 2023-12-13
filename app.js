require('dotenv').config();
require('./models/connection');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersProRouter = require('./routes/usersPro');
var usersRouter = require('./routes/users');
var etablissementsRouter = require('./routes/etablissements');
var eventsRouter = require('./routes/events');

var app = express();
const cors = require('cors');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/usersPro', usersProRouter);
app.use('/users', usersRouter);
app.use('/etablissements', etablissementsRouter);
app.use('/events', eventsRouter);

module.exports = app;
