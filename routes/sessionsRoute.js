var express = require('express');
router = express.Router();
var User = require('../models/user.js');
var authHelpers = require('../helpers/authHelpers.js');

//login page render
router.get('/login', function(req, res) {
  
});

//login check
router.post('/login', authHelpers.loginUser, function(req, res){
  
});

//logout
router.delete('/', function(req, res){
  
});

module.exports = router;
