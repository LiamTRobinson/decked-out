var express = require("express");
var router = express.Router({ mergeParams: true });

var User = require("../models/userModel.js");
var Deck = require("../models/deckModel.js");
var Card = require("../models/cardModel.js");




///////////////////////////////////
//********NEW DECK ROUTES********//
///////////////////////////////////




//DECKS NEW GET ROUTE
router.get("/new", function(req, res) {
	User.findById(req.params.userId)
		.exec(function(err, user) {
			res.render("decks/new", {
				user: user,
				menuOne: "Decks",
				menuTwo: "Cards",
				menuOnehref: `/${user.id}/decks/`,
				menuTwohref: `/${user.id}/cards/`
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
			res.redirect(`/${user.id}/decks`);
		});
});




///////////////////////////////////
//******DECK DISPLAY ROUTES******//
///////////////////////////////////




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
					menuTwohref: `/${user.id}/cards/`
				});		
		});	
});

//DECKS SHOW ROUTE
router.get("/:id", function(req, res) {
	User.findById(req.params.userId)
		.exec(function(err, user) {
			var deckToShow = user.decks.id(req.params.id);
			res.render("decks/show", {
				deck: deckToShow,
				user: user,
				menuOne: "Decks",
				menuTwo: "Cards",
				menuOnehref: `/${user.id}/decks/`,
				menuTwohref: `/${user.id}/cards/`
			});
		});
});




///////////////////////////////////
//******DECK DELETE ROUTES*******//
///////////////////////////////////




//DECKS DELETE ROUTE
router.delete("/:id/delete", function(req, res) {
	Deck.findByIdAndRemove(req.params.id, function(err, deck) {
		if (err) { conosle.log(err); }
		console.log(deck);
	});
	User.findById(req.params.userId)
		.exec(function(err, user) {
			if (err) { console.log(err); }
			for (var i = 0; i < user.decks.length; i++) {
				if (user.decks[i].id === req.params.id) {
					user.decks.splice(i, 1);
					user.save();
					res.redirect(`/${req.params.userId}/decks`);
				}
			}
		});
});




///////////////////////////////////
//*******DECK EDIT ROUTES********//
///////////////////////////////////




//DECKS EDIT GET ROUTE
router.get("/:id/edit", function(req, res) {
	User.findById(req.params.userId)
		.exec(function(err, user) {
			if (err) { console.log(err); }
			var deckToEdit = user.decks.id(req.params.id);
			res.render("decks/edit", {
				deck: deckToEdit,
				user: user,
				menuOne: "Decks",
				menuTwo: "Cards",
				menuOnehref: `/${user.id}/decks/`,
				menuTwohref: `/${user.id}/cards/`
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




///////////////////////////////////
//***CARD RELATED EDIT ROUTES****//
///////////////////////////////////




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
				user: user,
				deck: deck,
				menuOne: "Decks",
				menuTwo: "Cards",
				menuOnehref: `/${req.params.userId}/decks`
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

//DECKS REMOVE CARD ROUTE
router.patch("/:id/cardRemove/:cardId", function(req, res) {
	Deck.findById(req.params.id)
		.exec(function(err, deck) {
			if (err) { console.log(err); }
			for (var i = 0; i < deck.mainDeck.length; i++) {
				if (deck.mainDeck[i].id === req.params.cardId) {
					deck.mainDeck.splice(i, 1);
					deck.save();
					return
				}
			}
		});
	User.findById(req.params.userId)
		.exec(function(err, user) {
			if (err) { console.log(err); }
			deckToEdit = user.decks.id(req.params.id);
			for (var i = 0; i < deckToEdit.mainDeck.length; i++) {
				if (deckToEdit.mainDeck[i].id === req.params.cardId) {
					deckToEdit.mainDeck.splice(i, 1);
					user.save();
					res.redirect(`/${req.params.userId}/decks/${req.params.id}/edit`);
				}
			}
		})
});

//DECKS UPDATE CARD QUANTITY ROUTE

router.patch("/:id/quantity/:cardId", function(req, res) {
	User.findById(req.params.userId)
		.exec(function(err, user) {
			if (err) { console.log(err); }
			var deckToEdit = user.decks.id(req.params.id);
			var deckCardToEdit = deckToEdit.mainDeck.id(req.params.cardId);
			deckCardToEdit.quantity = req.body.quantity;
			user.save(function(err, user) {
				if (err) { conosle.log(err); }
				console.log(user);
			});
		});
	Deck.findById(req.params.id)
		.exec(function(err, deck) {
			if (err) { console.log(err); }
			var cardToEdit = deck.mainDeck.id(req.params.cardId);
			cardToEdit.quantity = req.body.quantity;
			deck.save(function(err, user) {
				if (err) { console.log(err); }
				res.redirect(`/${req.params.userId}/decks/${req.params.id}/edit`);
			});
		});
})

module.exports = router;
