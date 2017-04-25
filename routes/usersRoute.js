var express = require('express');
var router = express.Router();

var User = require("../models/userModel.js");
var Card = require("../models/cardModel.js");
var Deck = require("../models/deckModel.js");

//USER NEW GET ROUTE
router.get("/createaccount", function(req, res){
	res.render("users/new", {
		menuOne: "Back",
		menuOnehref: "/"
	});
});

//USER NEW POST ROUTE
router.post("/", function(req, res) {
	var user = new User ({
		email: req.body.email,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		userName: req.body.userName,
		password: req.body.password
	});
	user.save(function(err, user) {
		res.redirect("/sessions/login");
	});
});

//USER SHOW/EDIT ROUTE
router.get("/:id", function(req, res) {
	User.findById(req.params.id)
		.exec(function(err, user) {
			res.render("users/show", {
				user: user,
				menuOne: "Decks",
				menuTwo: "Cards",
				menuOnehref: `/${user.id}/decks/`,
				menuTwohref: `/${user.id}/cards/`
			});
		});
});

//USER PATCH ROUTE
router.patch("/:id", function(req, res) {
	User.findByIdAndUpdate(req.params.id, {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		userName: req.body.userName
	}, { new: true })
		.exec(function(err, user) {
			res.render("decks/index", {
				user: user,
				menuOne: "Decks",
				menuTwo: "Cards",
				menuOnehref: `/${user.id}/decks/`,
				menuTwohref: `/${user.id}/cards/`
			});
		});
});

//USER DELETE ROUTE
router.delete("/:id", function(req, res) {
	User.findById(req.params.id)
		.exec(function(err, user) {
			user.decks.forEach(function(deck) {
				Deck.findByIdAndRemove(deck.id)
					.exec(function(err, deck) {
						
					});
			});
		});
	User.findByIdAndRemove(req.params.id)
		.exec(function(err, user) {
			res.redirect("/");
		});
});

module.exports = router;
