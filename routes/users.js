var express = require('express');
var router = express.Router();

var User = require("../models/userModel.js");
var Card = require("../models/cardModel.js");
var Deck = require("../models/deckModel.js");


router.get('/:userId', function(req, res, next) {
  
  res.render("users/show", {

  });
});

module.exports = router;
