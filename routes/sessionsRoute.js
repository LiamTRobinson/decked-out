var express = require('express');
var router = express.Router();
var User = require('../models/userModel.js');
var authHelpers = require('../helpers/authHelpers.js');

//LOGIN PAGE RENDER
router.get('/login', function(req, res) {
  res.render("users/login", {
  	menuOne: "Back",
  	menuOnehref: "/"
  });
});

//LOGIN CHECK
router.post('/login', authHelpers.loginUser, function(req, res){
  res.redirect(`/users/${req.session.currentUser._id}`);
});

//LOGOUT
router.delete('/', function(req, res){
  req.session.destroy(function(){
  	res.redirect("/");
  });
});

module.exports = router;
