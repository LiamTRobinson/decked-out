var express = require("express");
var router = express.Router({ mergeParams: true });

var User = require("../models/userModel.js");
var Deck = require("../models/deckModel.js");
var Card = require("../models/cardModel.js");

//DECKS INDEX ROUTE
router.get("/", function(req, res) {
	User.findById(req.params.userId)
		.exec(function(err, user) {
			if (err) { console.log(err); }
				res.render("decks/index", {
					user: user,
					menuOne: "Decks",
					menuTwo: "Cards",
					menuOnehref: `/${user.id}/decks/`,
					menuTwohref: ""
				});		
		});	
});

//DECKS NEW GET ROUTE
router.get("/new", function(req, res) {
	User.findById(req.params.userId)
		.exec(function(err, user) {
			res.render("decks/new", {
				user: user,
				menuOne: "Decks",
				menuTwo: "Cards",
				menuOnehref: `/${user.id}/decks/`,
				menuTwohref: ""
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
	User.findById(req.params.userId)
		.exec(function(err, user) {
			var cards = user.cards;			
			var deck = user.decks.id(req.params.id);
			var filterFunction = function(card) {
				if (deck.mainDeck.length !== 0) {
					for (var i = 0; i < deck.mainDeck.length; i++) {
						if (card.id === deck.mainDeck[i].id) {
							return false;
						}
					}
				}
				return true;
			}
			var cardsToShow = cards.filter(filterFunction);
			res.render("decks/addcard", {
				cards: cardsToShow,
				user: req.params.userId,
				deck: req.params.id
			});
		});
});

//DECKS ADD CARD PATCH ROUTE
router.patch("/:id/edit/addcard/:cardId", function(req, res) {
	var cardToAdd = null;
	User.findById(req.params.userId)
		.exec(function(err, user) {
			var deckToEdit = user.decks.id(req.params.id);
			console.log(deckToEdit);
			cardToAdd = user.cards.id(req.params.cardId);
			console.log(cardToAdd);
			deckToEdit.mainDeck.push(cardToAdd);
			user.save();
		Deck.findById(req.params.id)
			.exec(function(err, deck) {
				deck.mainDeck.push(cardToAdd);
				deck.save();
				res.redirect(`/${req.params.userId}/decks/${req.params.id}/edit`);
			});	
		});
	
});

module.exports = router;
