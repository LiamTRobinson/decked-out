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
	var cardToFind = '"'+req.body.name+'"';
	mtg.card.all({ name: cardToFind })
		.on("data", card => {
			res.send(card);
		});
			
});




module.exports = router;