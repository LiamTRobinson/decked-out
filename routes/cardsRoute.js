var express = require("express");
var router = express.Router({ mergeParams: true });
const mtg = require("mtgsdk");

var Card = require("../models/cardModel.js");
var User = require("../models/userModel.js");

//NEW CARD GET ROUTE
router.get("/new", function(req, res) {
	res.render("cards/new", {
		user: req.params.userId
	});
});

//NEW CARD POST ROUTE
router.post("/new", function(req, res) {
	var userToFind = null;
	var cardToFind = req.body.name.toUpperCase();
	User.findById(req.params.userId)
		.exec(function(err, user) {
			userToFind = user;
			console.log(userToFind);
		})
		.then(function(err) {


	Card.findOne({ "name": cardToFind })
		.exec(function(err, result){
			console.log(result);
			if (result === null){
				var cardToSeach = '"'+cardToFind+'"';
				mtg.card.all({ name: cardToSeach })
					.on("data", stuff => {
						var newCard = new Card({
							name: stuff.name.toUpperCase(),
							manaCost: stuff.manaCost,
							cmc: stuff.cmc,
							type: stuff.type,
							imageUrl: stuff.imageUrl,
							cardSet: stuff.set,
							quantity: 0
						});
						newCard.save(function(err, card) {
							User.findById(req.params.userId)
								.exec(function(err, user) {
									user.cards.push(newCard);
									user.save();
									res.redirect(`/users/${req.params.userId}`);
								});
						});
					});
			}
			else if (userToFind.cards.id(result.id).id === result.id){
				res.redirect(`/users/${req.params.userId}`);
			}
			else {
				console.log(result.id);
				User.findById(req.params.userId)
					.exec(function(err, user) {
						user.cards.push(result);
						user.save(function(err, user) {
							if (err) { console.log(err); }
							res.redirect(`/users/${req.params.userId}`);
						});
					});
			}
	});
		});
});


module.exports = router;
