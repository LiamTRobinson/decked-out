var express = require('express');
var router = express.Router();
var User = require('../models/userModel.js');
var authHelpers = require('../helpers/authHelpers.js');

//login page render
router.get('/login', function(req, res) {
  res.render("users/login");
});

//login check
router.post('/login', authHelpers.loginUser, function(req, res){
  res.redirect(`/users/${req.session.currentUser._id}`);
});

//logout
router.delete('/', function(req, res){
  
});

module.exports = router;
