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
                });
        } 
    };

    const PlaytestControl = {
        //FROM HAND FUNCTIONS
        fromHandToBattlefield: function(cardId) {
            for (var i = 0; i < GameData.hand.length; i++) {
                if (GameData.hand[i]._id === cardId) {
                    var types = GameData.hand[i].types;
                    for (var j = 0; j < types.length; j++) {
                        if (types[j] === "Land") {
                            GameData.lands.push(GameData.hand[i]);
                            GameData.hand.splice(i, 1);
                            return;
                        }
                    }
                    GameData.battlefield.push(GameData.hand[i]);
                    GameData.hand.splice(i, 1);
                    return;
                }
            }
        },
        fromHandToGraveyard: function(cardId) {
            for (var i = 0; i < GameData.hand.length; i++) {
                if (GameData.hand[i]._id === cardId) {
                    GameData.graveyard.push(GameData.hand[i]);
                    GameData.hand.splice(i, 1);
                    return;
                }
            }
        },
        fromHandToExile: function(cardId) {
            for (var i = 0; i < GameData.hand.length; i++) {
                if (GameData.hand[i]._id === cardId) {
                    GameData.exile.push(GameData.hand[i]);
                    GameData.hand.splice(i, 1);
                    return;
                }
            }
        },
        fromHandToLibrary: function(cardId) {
            for (var i = 0; i < GameData.hand.length; i++) {
                if (GameData.hand[i]._id === cardId) {
                    GameData.library.unshift(GameData.hand[i]);
                    GameData.hand.splice(i, 1);
                    return;
                }
            }
        },
        //FROM BATTLEFIELD FUNCTIONS
        fromBattlefieldToGraveyard: function(cardId) {
            for (var i = 0; i < GameData.battlefield.length; i++) {
                if (GameData.battlefield[i]._id === cardId) {
                    GameData.graveyard.push(GameData.battlefield[i]);
                    GameData.batttlefield.splice(i, 1);
                    return;
                }
            }
        },
        fromBattlefieldToExile: function(cardId) {
            for (var i = 0; i < GameData.battlefield.length; i++) {
                if (GameData.battlefield[i]._id === cardId) {
                    GameData.exile.push(GameData.battlefield[i]);
                    GameData.batttlefield.splice(i, 1);
                    return;
                }
            }
        },
        fromBattlefieldToHand: function(cardId) {
            for (var i = 0; i < GameData.battlefield.length; i++) {
                if (GameData.battlefield[i]._id === cardId) {
                    GameData.hand.push(GameData.battlefield[i]);
                    GameData.batttlefield.splice(i, 1);
                    return;
                }
            }
        },
        fromBattlefieldToLibrary: function(cardId) {
            for (var i = 0; i < GameData.battlefield.length; i++) {
                if (GameData.battlefield[i]._id === cardId) {
                    GameData.library.unshift(GameData.battlefield[i]);
                    GameData.batttlefield.splice(i, 1);
                    return;
                }
            }
        },
        //TO HAND FUNCTIONS
        drawCard: function() {
            GameData.hand.push(GameData.library[0]);
            GameData.library.splice(0, 1);
        },
        fromGraveyardToHand: function(cardId) {
            for (var i = 0; i < GameData.graveyard.length; i++) {
                if (GameData.graveyard[i]._id === cardId) {
                    GameData.hand.push(GameData.graveyard[i]);
                    GameData.graveyard.splice(i, 1);
                    return;
                }
            }
        },
        fromExileToHand: function(cardId) {
            for (var i = 0; i < GameData.exile.length; i++) {
                if (GameData.exile[i]._id === cardId) {
                    GameData.hand.push(GameData.exile[i]);
                    GameData.exile.splice(i, 1);
                    return;
                }
            }
        }
    };

    const ViewControl = {
        updateHand: function() {
            $("#hand").empty();
            for (var i = 0; i < GameData.hand.length; i++) {
                $("#hand").append(`<div class='col s2' data-id='${GameData.hand[i]._id}' style='background: url(${GameData.hand[i].imageUrl}); background-size: cover; background-size: contain; height: 300px; background-repeat: no-repeat; margin-top: 5%;'></div>`);
            }
        },
        updateLands: function() {
            $("#lands").empty();
            for (var i = 0; i < GameData.lands.length; i++) {
                $("#lands").append(`<div class='col s2' data-id='${GameData.lands[i]._id}' style='background: url(${GameData.lands[i].imageUrl}); background-size: cover; background-size: contain; height: 300px; background-repeat: no-repeat; margin-top: 5%;'></div>`);
            }
        }
    };

    const EventHandlers = {

    };

    //PLAYTEST EVENT BINDINGS
    $("#start-playtest").on("click", GameData.startGame);
    $("#draw-card").on("click", PlaytestControl.drawCard);
});
