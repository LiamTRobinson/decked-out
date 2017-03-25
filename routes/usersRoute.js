var express = require('express');
var router = express.Router();

var User = require("../models/userModel.js");
var Card = require("../models/cardModel.js");
var Deck = require("../models/deckModel.js");

//user new get route
router.get("/createaccount", function(req, res){
	res.render("users/new");
});

//user show route
router.get("/:id", function(req, res) {
	User.findById(req.params.id)
		.exec(function(err, user) {
			res.render("users/show", {
				user: user
			});
		});
});

//user new post route
router.post("/", function(req, res) {
	console.log(req.body);
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
