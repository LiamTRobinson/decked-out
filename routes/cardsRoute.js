var express = require("express");
var router = express.Router({ mergeParams: true });
const mtg = require("mtgsdk");

var Card = require("../models/cardModel");
var User = require("../models/userModel");

//NEW CARD GET ROUTE
router.get("/new", function(req, res) {
	res.render("cards/new", {
		user: req.params.userId
	});
});

//NEW CARD POST ROUTE
router.post("/new", function(req, res) {
	var cardToFind = `"`+`${req.body.name}`+`"`;
	mtg.card.all({ name: cardToFind})
		.on("data", function(err, card) {
			if (err) { console.log(err); }
			console.log(card);
			var foundCard = new Card({
				name: card.name,
				manaCost: card.manaCost,
				cmc: card.cmc,
				type: card.type,
				imageUrl: card.imageUrl,
				cardSet: card.set,
				quantity: 0
			});
			foundCard.save(function(err, foundCard) {
				if (err) { console.log(err); }
				User.findById(req.params.userId)
					.exec(function(err, user) {
						if (err) { console.log(err); }
						else {
							user.cards.push(foundCard);
							user.save(function(err, user){
								if (err) { console.log(err); }
								console.log(user);
								res.redirect(`/users/${req.params.userId}`);
							});
						}
					});
			});
		});
});




module.exports = router;