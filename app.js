var createError = require('http-errors');
const express = require('express');
const app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var config = require("./config/config");

//import body-parser to parser the req from client
const bodyParser = require('body-parser');
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const taskRouter = require('./routes/task');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/task', taskRouter)


//middleware
app.use(cors());


//Imported mongoose pakage
var mongoose = require("mongoose");

//Config file 
require("dotenv/config");



// view engine setup

var handlebars = require('express-handlebars').create({
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/shared"),
  defaultLayout: 'layout',
  extname: 'hbs'
  
});

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "views"));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// mongooes db setup/connection
mongoose.connect(config.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
  if (!error) {
    console.log("Database Connected Successfully !");
  } else {
    console.log("Failed to connect database.");
  }
})



module.exports = app;
