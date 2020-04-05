var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require("./config/config")
var mongoose = require("mongoose");
var session = require("express-session");
var bodyParser = require("body-parser")
var passport = require("passport");
var { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access")
var handlebars = require("handlebars");
require("./passport")(passport);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users')(passport);
var taskRouter = require('./routes/task');




var app = express();

// view engine setup
var hbs = require('express-handlebars').create({
  partialsDir: path.join(__dirname, 'views/shared'),
  extname: 'hbs',
  defaultLayout: 'layout',
  handlebars:allowInsecurePrototypeAccess(handlebars)
  });
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'vasujoshi',
  saveUninitialized: false,
  resave: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/task', taskRouter)

// mongooes db setup/connection
mongoose.connect(config.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
  if (!error) {
    console.log("Database Connected Successfully !");
  } else {
    console.log("Failed to connect database.");
  }
})



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

module.exports = app;
