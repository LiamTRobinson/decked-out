var express = require("express");
var router = express.Router({ mergeParams: true });

var User = require("../models/userModel.js");
var Deck = require("../models/deckModel.js");
var Card = require("../models/cardModel.js");

//DECKS NEW GET ROUTE
router.get("/new", function(req, res) {
	User.findById(req.params.userId)
		.exec(function(err, user) {
			res.render("decks/new", {
				user: user
			});
		});
});

//DECKS NEW POST ROUTE
router.post("/", function(req, res) {
	var deck = new Deck({
		name: req.body.name,
		format: req.body.format
	});
	deck.save(function(err, deck) {
		if (err) { console.log(err); }
		console.log(`${deck} saved!`);
	});
	User.findById(req.params.userId)
		.exec(function(err, user) {
			if (err) { console.log(err); }
			user.decks.push(deck);
			user.save(function(err, user) {
				if (err) { console.log(err); }
				console.log(`${deck}, ${user}`);
			});
			res.redirect(`/users/${user.id}`);
		});
});

//DECKS SHOW ROUTE
router.get("/:id", function(req, res) {
	Deck.findById(req.params.id)
		.exec(function(err, deck) {
			if (err) { console.log(err); }
			res.render("decks/show", {
				deck: deck,
				user: req.params.userId
			});
		});
});

//DECKS EDIT GET ROUTE
router.get("/:id/edit", function(req, res) {
	Deck.findById(req.params.id)
		.exec(function(err, deck) {
			if (err) { console.log(err); }
			res.render("decks/edit", {
				deck: deck,
				user: req.params.userId
			});
		});
});

//DECKS EDIT PATCH ROUTE
router.patch("/:id/edit", function(req, res) {
	User.findById(req.params.userId)
		.exec(function(err, user) {
			if (err) { console.log(err); }
			var deckToEdit = user.decks.id(req.params.id);
			deckToEdit.name = req.body.name;
			deckToEdit.format = req.body.format;
			user.save(function(err, user) {
				if (err) { console.log(err); }
				console.log(user);
			});
		});
	Deck.findByIdAndUpdate(req.params.id, {
		$set: {
			name: req.body.name,
			format: req.body.format
		}
	}, { new: true }, function(err, deck) {
		if (err) { console.log(err); }
		console.log(`${req.params.userId}, ${req.params.id}`);
		res.redirect(`/${req.params.userId}/decks/${req.params.id}`);
	});
});

//DECKS ADD CARD GET ROUTE
router.get("/:id/edit/addcard", function(req, res) {
	User.getById(req.params.userId)
		.exec(function(err, user) {
			var cards = user.cards;
			var deck = user.decks.id(req.params.id);
			var cardsToShow = deck.filter(function(card) {
				for (var i = 0; i < cards.length; i++) {
					if (card.id === cards[i].id) {
						return false
					}
				}
				return true;
			});
			res.render("decks/addcard", {
				cards: cardsToShow,
				user: req.params.userId,
				deck: req.params.id
			});
		});
	
});


module.exports = router;