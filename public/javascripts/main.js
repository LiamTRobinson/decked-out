$(document).ready(function(){ 
    $('.modal').modal();
    $('.carousel').carousel();

//SAMPLE HAND GENERATOR
    $("#sample-hand-trigger").on("click", function() {
    	var data = $(this).data("store");
    	var array = data.split(",");
    	for (var i = 0; i < 7; i++) {
    		var cardIndex = Math.floor(Math.random() * array.length);
    		var card = array[cardIndex];
    		$(`#sh-card-${i}`).attr("src", card);
    		array.splice(cardIndex, 1);
    	}
    });

//PLAYTESTING FUNCTIONS
    const GameData = {
        deckId: null,
        userId: null,
        playtestDeck: null,
        currentHand: [],
        startGame: function() {
            this.deckId = $("#start-playtest").data("deck");
            this.userId = $("#start-playtest").data("user");
            $.get(`/1/decks/${this.deckId}/deckToPlay`)
                .then(function(data) {
                    console.log(data);
                    GameData.playtestDeck = data;
                });
        } 
    };

    const PlaytestControl = {
        drawCard: function() {
            GameData.currentHand.push(GameData.playtestDeck[0]);
            GameData.playtestDeck.splice(0, 1);
            console.log(GameData.playtestDeck);
            console.log(GameData.currentHand);
        }

    };

    const ViewControl = {

    };

    const EventHandlers = {

    };

    //EVENT BINDINGS
    $("#start-playtest").on("click", GameData.startGame);
    $("#draw-card").on("click", PlaytestControl.drawCard);
});
