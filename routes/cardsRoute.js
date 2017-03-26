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
	var check = null;
	var userToFind = null;
	var newCard = null;
	var cardToFind = req.body.name.toUpperCase();
	User.findById(req.params.userId)
		.exec(function(err, user) {
			userToFind = user;
		})
		.then(function(err) {
			Card.findOne({ "name": cardToFind })
				.exec(function(err, result){	
					if (result === null){
						var cardToSeach = '"'+cardToFind+'"';
						mtg.card.all({ name: cardToSeach, pageSize: 1 })
							.on("data", stuff => {
								var promise = new Promise(function(resolve, reject) {
									newCard = new Card({
									name: stuff.name.toUpperCase(),
									manaCost: stuff.manaCost,
									cmc: stuff.cmc,
									type: stuff.type,
									imageUrl: stuff.imageUrl,
									cardSet: stuff.set,
									quantity: 0
								});
								if (check === null) {
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
									return res.redirect(`/users/${req.params.userId}`);
									});
									
									
								});
							});
					}
					else if (userToFind.cards.id(result.id).id === result.id){
						res.redirect(`/users/${req.params.userId}`);
					}
					else {
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
