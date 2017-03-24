var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//use native promises
mongoose.Promise = global.Promise;

//schemas
var CardSchema = new Schema({
	name: String,
	names: [String],
	manaCost: String,
	cmc: Number,
	type: String,
	imageUrl: String,
	set: String
});

var DeckSchema = new Schema({
	name: String,
	mainDeck: [CardSchema],
	format: String
});

var UserSchema = new Schema({
	userName: String,
	password: String,
	email: { type: String, required: true, unique: true },
	firstName: String,
	lastName: String,
	cards: [CardSchema],
	decks: [DeckSchema]
});

//set models for export
var CardModel = mongoose.model("Card", CardSchema);
var DeckModel = mongoose.model("Deck", DeckSchema);
var UserModel = mongoose.model("User", UserSchema);

//export models
module.exports = {
	Card: CardModel,
	Deck: DeckModel,
	User: UserModel
};
