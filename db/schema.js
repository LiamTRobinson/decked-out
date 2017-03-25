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
	cardSet: String
});

var DeckSchema = new Schema({
	name: { type: String, required: true },
	mainDeck: [Number],
	format: { type: String, required: true }
});

var UserSchema = new Schema({
	userName: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	firstName: String,
	lastName: String,
	cards: [Number],
	decks: [Number]
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
