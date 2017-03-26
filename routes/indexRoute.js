var express = require('express');
var router = express.Router();

//HOME PAGE
router.get('/', function(req, res, next) {
  res.render('index', {
  	menuOne: "Log In",
  	menuTwo: "Create Account",
  	menuOnehref: "/sessions/login",
  	menuTwohref: "/users/createaccount"
  });
});

module.exports = router;
