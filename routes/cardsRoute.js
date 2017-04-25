var express = require("express");
var router = express.Router({ mergeParams: true });
const mtg = require("mtgsdk");

var Card = require("../models/cardModel.js");
var User = require("../models/userModel.js");
var Deck = require("../models/deckModel.js");

//CARDS INDEX ROUTE
router.get("/", function(req, res) {
	User.findById(req.params.userId)
		.exec(function(err, user) {
			res.render("cards/index", {
				user: user,
				menuOne: "Decks",
				menuTwo: "Cards",
				menuOnehref: `/${req.params.userId}/decks`,
				menuTwohref: `/${req.params.userId}/cards`
			});
		});
});

//NEW CARD GET ROUTE
router.get("/new", function(req, res) {
	User.findById(req.params.userId)
		.exec(function(err, user) {
			res.render("cards/new", {
				user: user,
				menuOne: "Decks",
				menuTwo: "Cards",
				menuOnehref: `/${req.params.userId}/decks`,
				menuTwohref: `/${req.params.userId}/cards`
			});
		});
});

//NEW CARD POST ROUTE
router.post("/new", function(req, res) {
	var check = null;
	var userToFind = null;
	var newCard = null;
	var cardToFind = req.body.name.toUpperCase();
	User.findById(req.params.userId)
		.exec(function(err, user) {
			userToFind = user;
		})
		.then(function(err) {
			//THIS CHECKS THE DATABASE FOR THE CARD THE USER IS TRYING TO ADD
			Card.findOne({ "name": cardToFind })
				.exec(function(err, result){
				//IF THE CARD DNE IN DB, SEARCH THE API	
					if (result === null){
						var cardToSeach = '"'+cardToFind+'"';
						mtg.card.all({ name: cardToSeach, pageSize: 1 })
							.on("data", stuff => {
								var promise = new Promise(function(resolve, reject) {
									newCard = new Card({
										name: stuff.name.toUpperCase(),
										manaCost: stuff.manaCost,
										cmc: stuff.cmc,
										types: stuff.types,
										imageUrl: stuff.imageUrl,
										quantity: 0
									});
									if (check === null && newCard.imageUrl.length > 0) {
										resolve();
									}
									else {
										reject();
									}
								});
								promise.then(function() {
									User.findById(req.params.userId)
									.exec(function(err, user) {
										user.cards.push(newCard);
										user.save();
										newCard.save();
										check = 1;
										return res.redirect(`/${req.params.userId}/cards`);
									});	
								});
							});
					}
					//IF THE USER ALREADY HAS THE CARD THEY SEARCHED
					else if (userToFind.cards.id(result.id) !== null){
						res.redirect(`/${req.params.userId}/cards`);
					}
					//IF THE USER DOESN'T HAVE THE CARD BUT IT'S IN DB
					else {
						User.findById(req.params.userId)
							.exec(function(err, user) {
								user.cards.push(result);
								user.save(function(err, user) {
									res.redirect(`/${req.params.userId}/cards`);
								});
							});
					}
				});
		});
});

//CARD DELETE ROUTE
router.delete("/:id/delete", function(req, res) {
	var deckToEdit = null;
	User.findById(req.params.userId)
		.exec(function(err, user) {
			for (var i = 0; i < user.decks.length; i++) {
				for (var j = 0; j < user.decks[i].mainDeck.length; j++) {
					if (user.decks[i].mainDeck[j].id === req.params.id) {
						user.decks[i].mainDeck.splice(j, 1);
						deckToEdit = user.decks[i].id;
						user.save(function(err, user) {
							Deck.findById(deckToEdit)
								.exec(function(err, deck) {
									for (var l = 0; l < deck.mainDeck.length; l++) {
										if (deck.mainDeck[l].id === req.params.id) {
											deck.mainDeck.splice(l, 1);
											deck.save();
										}
									}
								});
						});
					}
				}
			}
			for (var k = 0; k < user.cards.length; k++) {
				if (user.cards[k].id === req.params.id) {
					user.cards.splice(k, 1);
					user.save();
				}
			}
			res.redirect(`/${req.params.userId}/cards`);
		});
});

module.exports = router;
