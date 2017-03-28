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
        library: null,
        hand: [],
        battlefield: [],
        lands: [],
        graveyard:[],
        exile:[],
        startGame: function() {
            this.deckId = $("#start-playtest").data("deck");
            this.userId = $("#start-playtest").data("user");
            $.get(`/1/decks/${this.deckId}/deckToPlay`)
                .then(function(data) {
                    GameData.library = data;
                    console.log(data)
                });
        } 
    };

    const PlaytestControl = {
        drawCard: function() {
            GameData.hand.push(GameData.library[0]);
            GameData.library.splice(0, 1);
        },
        fromHandToBattlefield: function(cardId) {
            for (var i = 0; i < GameData.hand.length; i++) {
                if (GameData.hand[i]._id === cardId) {
                    var types = GameData.hand[i].types;
                    for (var j = 0; j < types.length; j++) {
                        if (types[j] === "Land") {
                            GameData.lands.push(GameData.hand[i]);
                            GameData.splice(i, 1);
                            return;
                        }
                    }
                    GameData.battlefield.push(GameData.hand[i]);
                    GameData.splice(i, 1);
                }
            }
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
