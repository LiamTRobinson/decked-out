//packages
var express = require('express');
var app = express();
require('dotenv').config()
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var hbs = require("hbs");
var methodOverride = require("method-override");
const mtg = require("mtgsdk");

//use packages
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//mongoose stuff
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;

db.on('error', function(err){
  console.log(err);
});
db.once('open', function() {
  console.log("database has been connected!");
});

//session stuff
app.use(session({
	secret: "dogzroolcatzdrule",
	store: new MongoStore({ mongooseConnection: db}),
	resave: false,
	saveUninitialized: false
}))

//require routes
var indexRoute = require('./routes/indexRoute');
var usersRoute = require('./routes/usersRoute');
var sessionsRoute = require("./routes/sessionsRoute");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//use routes
app.use('/', indexRoute);
app.use('/users', usersRoute);
app.use("/sessions", sessionsRoute);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
