var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//USE NATIVE PROMISES
mongoose.Promise = global.Promise;

//SCHEMAS
	//CARD SCHEMA
var CardSchema = new Schema({
	name: String,
	manaCost: String,
	cmc: Number,
	types: Array,
	imageUrl: String,
	quantity: Number
});
	
	//DECK SCHEMA
var DeckSchema = new Schema({
	name: { type: String, required: true },
	mainDeck: [CardSchema],
	format: { type: String, required: true }
});

	//USER SCHEMA
var UserSchema = new Schema({
	userName: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	firstName: String,
	lastName: String,
	cards: [CardSchema],
	decks: [DeckSchema]
});

//SET MODELS FOR EXPORT
var CardModel = mongoose.model("Card", CardSchema);
var DeckModel = mongoose.model("Deck", DeckSchema);
var UserModel = mongoose.model("User", UserSchema);

//EXPORT MODELS
module.exports = {
	Card: CardModel,
	Deck: DeckModel,
	User: UserModel
};
