//PACKAGES
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

//USE PACKAGES
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//MONGOOSE STUFF
var mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;

db.on('error', function(err){
  console.log(err);
});
db.once('open', function() {
  console.log("database has been connected!");
});

//SESSION STUFF
app.use(session({
	secret: "dogzroolcatzdrule",
	store: new MongoStore({ mongooseConnection: db}),
	resave: false,
	saveUninitialized: false
}))

//REQUIRE ROUTES
var indexRoute = require('./routes/indexRoute');
var usersRoute = require('./routes/usersRoute');
var sessionsRoute = require("./routes/sessionsRoute");
var decksRoute = require("./routes/decksRoute");

//VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//USE ROUTES
app.use('/', indexRoute);
app.use('/users', usersRoute);
app.use("/sessions", sessionsRoute);
app.use("/:userId/decks", decksRoute);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


//CATCH 404 AND FORWARD TO ERROR HANDLER
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//ERROR HANDLER
app.use(function(err, req, res, next) {
  //SET LOCALS, ONLY PROVIDING ERROR IN DEVELOPMENT
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //RENDER THE ERROR PAGE
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
