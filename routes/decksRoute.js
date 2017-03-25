var express = require("express");
var router = express.Router({ mergeParams: true });

var User = require("../models/userModel.js");
var Deck = require("../models/deckModel.js");
var Card = require("../models/cardModel.js");

//decks new get route
router.get("/new", function(req, res) {
	User.findById(req.params.userId)
		.exec(function(err, user) {
			res.render("decks/new", {
				user: user
			});
		});
});

//decks new post route




module.exports = router;