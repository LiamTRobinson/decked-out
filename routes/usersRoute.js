var express = require('express');
var router = express.Router();

var User = require("../models/userModel.js");
var Card = require("../models/cardModel.js");
var Deck = require("../models/deckModel.js");

//user show route

//user new route
router.get("/createaccount", function(req, res){
	res.render("users/new");
});

//user new post route
router.get("/", function(req, res) {
	var user = new User ({
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		userName: req.body.userName,
		password: req.body.password
	});
	user.save(function(err, user) {
		if (err) { console.log(err); }
		console.log(user);
		res.redirect("/sessions/login");
	});
});

module.exports = router;
