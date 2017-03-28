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
        fromHandToBattlefield: function(cardIndex) {
            for (var i = 0; i < GameData.hand[cardIndex].types.length; i++) {
                if (GameData.hand[cardIndex].types[i] === "Land") {
                    GameData.lands.push(GameData.hand[cardIndex]);
                    GameData.hand.splice(cardIndex, 1);
                    return;
                }
            }
            GameData.battlefield.push(GameData.hand[cardIndex]);
            GameData.hand.splice(cardIndex, 1);
        },
        fromHandToGraveyard: function(cardIndex) {
            GameData.graveyard.push(GameData.hand[cardIndex]);
            GameData.hand.splice(cardIndex, 1);
        },
        fromHandToExile: function(cardIndex) {
            GameData.exile.push(GameData.hand[cardIndex]);
            GameData.hand.splice(cardIndex, 1);
        },
        fromHandToLibrary: function(cardIndex) {
            GameData.library.unshift(GameData.hand[cardIndex]);
            GameData.hand.splice(cardIndex, 1);
        },
        //FROM BATTLEFIELD FUNCTIONS
        fromBattlefieldToGraveyard: function(cardIndex) {
            GameData.graveyard.push(GameData.battlefield[cardIndex]);
            GameData.batttlefield.splice(cardIndex, 1);
        },
        fromBattlefieldToExile: function(cardIndex) {
            GameData.exile.push(GameData.battlefield[cardIndex]);
            GameData.batttlefield.splice(cardIndex, 1);
        },
        fromBattlefieldToHand: function(cardIndex) {
            GameData.hand.push(GameData.battlefield[cardIndex]);
            GameData.batttlefield.splice(cardIndex, 1);
        },
        fromBattlefieldToLibrary: function(cardIndex) {
            GameData.library.unshift(GameData.battlefield[cardIndex]);
            GameData.batttlefield.splice(cardIndex, 1);
        },
        //TO HAND FUNCTIONS
        drawCard: function() {
            GameData.hand.push(GameData.library[0]);
            GameData.library.splice(0, 1);
        },
        fromGraveyardToHand: function(cardIndex) {
            GameData.hand.push(GameData.graveyard[cardIndex]);
            GameData.graveyard.splice(cardIndex, 1);
        },
        fromExileToHand: function(cardIndex) {
            GameData.hand.push(GameData.exile[cardIndex]);
            GameData.exile.splice(cardIndex, 1);
        }
    };

    const ViewControl = {
        //UPDATE VIEWS FUNCTIONS
        updateHand: function() {
            $("#hand").empty();
            for (var i = 0; i < GameData.hand.length; i++) {
                $("#hand").append(`<a class='col s2 pt-hand' id='pt-hand-${i}' style='background: url(${GameData.hand[i].imageUrl}); background-size: cover; background-size: contain; height: 300px; background-repeat: no-repeat; margin-top: 5%;' href='#pt-single-card-hand'></a>`);
            }
            $(".pt-hand").on("click", handCardClick);
        },
        updateLands: function() {
            $("#lands").empty();
            for (var i = 0; i < GameData.lands.length; i++) {
                $("#lands").append(`<div class='col s2 pt-lands' id='pt-lands-${i}' style='background: url(${GameData.lands[i].imageUrl}); background-size: cover; background-size: contain; height: 300px; background-repeat: no-repeat; margin-top: 5%;'></div>`);
            }
        },
        updateBattlefield: function() {
            $("#battlefield").empty();
            for (var i = 0; i < GameData.battlefield.length; i++) {
                $("#battlefield").append(`<div class='col s2 pt-battlefield' id='pt-battlefield-${i}' style='background: url(${GameData.battlefield[i].imageUrl}); background-size: cover; background-size: contain; height: 300px; background-repeat: no-repeat; margin-top: 5%;'></div>`);
            }
            $(".pt-battlefield").on("click", function(){});
        },
        updateExile: function() {
            $("#exile").empty();
            for (var i = 0; i < GameData.exile.length; i++) {
                $("#exile").append(`<div class='col s2 pt-exile' id='pt-exile-${i}' style='background: url(${GameData.exile[i].imageUrl}); background-size: cover; background-size: contain; height: 300px; background-repeat: no-repeat; margin-top: 5%;'></div>`);
            }
        },
        updateGraveyard: function() {
            $("#graveyard").empty();
            for (var i = 0; i < GameData.graveyard.length; i++) {
                $("#graveyard").append(`<div class='col s2 pt-graveyard' id='pt-graveyard-${i}' style='background: url(${GameData.graveyard[i].imageUrl}); background-size: cover; background-size: contain; height: 300px; background-repeat: no-repeat; margin-top: 5%;'></div>`);

            }
        }

    };

    const EventHandlers = {
        drawCard: function() {
            PlaytestControl.drawCard();
            ViewControl.updateHand();
        },
        handToGraveyard: function(cardIndex) {
            PlaytestControl.fromHandToGraveyard(cardIndex);
            ViewControl.updateGraveyard();
            ViewControl.updateHand();
        },
        handToExile: function(cardIndex) {
            PlaytestControl.fromHandToExile(cardIndex);
            ViewControl.updateExile();
            ViewControl.updateHand();
        },
        handToLibrary: function(cardIndex) {
            PlaytestControl.fromHandToLibrary(cardIndex);
            ViewControl.updateHand();
        },
        handToBattlefield: function(cardIndex) {
            PlaytestControl.fromHandToBattlefield(cardIndex);
            ViewControl.updateBattlefield();
            ViewControl.updateLands();
            ViewControl.updateHand();
        }
    };

//WHEN A CARD IN HAND IS CLICKED
    var handCardClick = function() {
        var splitArray = $(this).attr("id").split("-");
        var index = splitArray[2];
        var image = GameData.hand[parseInt(index)].imageUrl;
        console.log(index, image);
        $("#hand-to-graveyard").data("index", index);
        $("#hand-to-exile").data("index", index);
        $("#hand-to-battlefield").data("index", index);
        $("#hand-to-library").data("index", index);
        $("#pt-single-card-hand-image").attr("src", image);
    };

//PLAYTEST EVENT BINDINGS
    $("#hand-to-battlefield").on("click", function() {
        console.log(this)
        var index = parseInt($(this).data("index"));
        EventHandlers.handToBattlefield(index);
    });
    $("#hand-to-library").on("click", function() {
        console.log(this);
        var index = parseInt($(this).data("index"));
        EventHandlers.handToLibrary(index);
    });
    $("#hand-to-exile").on("click", function() {
        console.log(this);
        var index = parseInt($(this).data("index"));
        EventHandlers.handToExile(index);
    });
    $("#hand-to-graveyard").on("click", function() {
        console.log(this);
        console.log($(this).data("index"));
        var index = parseInt($(this).data("index"));
        console.log(index)
        EventHandlers.handToGraveyard(index);
    });
    $("#start-playtest").on("click", GameData.startGame);
    $("#draw-card").on("click", EventHandlers.drawCard);
});
