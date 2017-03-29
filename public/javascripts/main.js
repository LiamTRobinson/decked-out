$(document).ready(function(){ 
//MATERIALIZE COMPONENT INITIALIZERS
    $('.modal').modal();
    $('.carousel').carousel();
    $(".nav-extended.Start").append('<div class="nav-content" style="margin-bottom: 10px;"><ul class="tabs tabs-transparent"><li class="tab"><a href="#battlefield-tab">Battlefield</a></li><li class="tab"><a href="#graveyard-tab">Graveyard <span id="graveyard-total">(0)</span></a></li><li class="tab"><a href="#exile-tab">Exile <span id="exile-total">(0)</span></a></li></ul></div>');
    $('ul.tabs').tabs();
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
        setTimeout(function(){$("#sample-hand").click()}, 1);
    });


//PLAYTESTING FUNCTIONS (TO BE REFACTORED!!)
    const GameData = {
        //THIS IS THE GAME DATA BEING MANIPULATED
        deckId: null,
        userId: null,
        library: null,
        hand: [],
        battlefield: [],
        lands: [],
        graveyard:[],
        exile:[],
        replay: false,
        //STARTS THE GAME
        startGame: function() {
            GameData.hand = [];
            GameData.battlefield = [];
            GameData.lands = [];
            GameData.graveyard = [];
            GameData.exile = [];
            ViewControl.updateBattlefield();
            ViewControl.updateLands();
            ViewControl.updateGraveyard();
            ViewControl.updateExile();
            ViewControl.updateHand();
            if (GameData.replay === false) {
                var splitArray = $("#nav-menu-twoStart").attr("href").split(",");
                GameData.deckId = splitArray[1];
                GameData.userId = splitArray[0].slice(1);
            }
            $.get(`/1/decks/${GameData.deckId}/deckToPlay`)
                .then(function(data) {
                    GameData.library = data; 
                    GameData.replay = true;
                    ViewControl.updateLibrary();      
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
            GameData.battlefield.splice(cardIndex, 1);
        },
        fromBattlefieldToExile: function(cardIndex) {
            GameData.exile.push(GameData.battlefield[cardIndex]);
            GameData.battlefield.splice(cardIndex, 1);
        },
        fromBattlefieldToHand: function(cardIndex) {
            console.log(GameData.battlefield);
            GameData.hand.push(GameData.battlefield[cardIndex]);
            GameData.battlefield.splice(cardIndex, 1);
        },
        fromBattlefieldToLibrary: function(cardIndex) {
            GameData.library.unshift(GameData.battlefield[cardIndex]);
            GameData.battlefield.splice(cardIndex, 1);
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
        },
        //FROM LANDS FUNCTIONS
        fromLandsToHand: function(cardIndex) {
            GameData.hand.push(GameData.lands[cardIndex]);
            GameData.lands.splice(cardIndex, 1);
        },
        fromLandsToGraveyard: function(cardIndex) {
            console.log(GameData.lands[cardIndex]);
            GameData.graveyard.push(GameData.lands[cardIndex]);
            GameData.lands.splice(cardIndex, 1);
        },
        fromLandsToLibrary: function(cardIndex) {
            GameData.library.unshift(GameData.lands[cardIndex]);
            GameData.lands.splice(cardIndex, 1);
        },
        fromLandsToExile: function(cardIndex) {
            GameData.exile.push(GameData.lands[cardIndex]);
            GameData.lands.splice(cardIndex, 1);
        }
    };

    const ViewControl = {
        //UPDATE VIEWS FUNCTIONS
        updateHand: function() {
            $("#hand").empty();
            for (var i = 0; i < GameData.hand.length; i++) {
                $("#hand").append(`<a class='pt-hand' id='pt-hand-${i}' href='#pt-single-card-hand'><img style='margin-top:5%' class='col s3 m3 l2 modal-action modal-close' src=${GameData.hand[i].imageUrl}></a>`);
            }
            $(".pt-hand").on("click", handCardClick);
            if (GameData.hand.length > 0) {
                $("#hand-total").html(`(${GameData.hand.length})`);
            }
        },
        updateLands: function() {
            $("#lands").empty();
            for (var i = 0; i < GameData.lands.length; i++) {
                $("#lands").append(`<a class='pt-lands' id='pt-lands-${i}' style='margin-top: 5%;' href='#pt-single-card-lands'><img class='col s3 m3 l2' src=${GameData.lands[i].imageUrl}></a>`);
            }
            $(".pt-lands").on("click", landsCardClick);
            if (GameData.lands.length > 0) {
                $("#lands-total").html(`(${GameData.lands.lenth})`);
            }
        },
        updateBattlefield: function() {
            $("#battlefield").empty();
            for (var i = 0; i < GameData.battlefield.length; i++) {
                $("#battlefield").append(`<a class='pt-battlefield' id='pt-battlefield-${i}' style='margin-top: 5%;' href='#pt-single-card-battlefield'><img class='col s3 m3 l2' src=${GameData.battlefield[i].imageUrl}></a>`);
            }
            $(".pt-battlefield").on("click", battlefieldCardClick);
        },
        updateExile: function() {
            $("#exile").empty();
            for (var i = 0; i < GameData.exile.length; i++) {
                $("#exile").append(`<a class='pt-exile' id='pt-exile-${i}' style='margin-top: 5%;'><img class='col s3 m3 l2' src=${GameData.exile[i].imageUrl}></a>`);
            }
            $(".pt-exile").on("click", exileCardClicked);
            if (GameData.exile.length > 0) {
                $("#exile-total").html(`(${GameData.exile.lenth})`);
            }
        },
        updateGraveyard: function() {
            $("#graveyard").empty();
            for (var i = 0; i < GameData.graveyard.length; i++) {
                $("#graveyard").append(`<a class='pt-graveyard' id='pt-graveyard-${i}' style='margin-top: 5%;'><img class='col s3 m3 l2' src=${GameData.graveyard[i].imageUrl}></a>`);
            }
            $(".pt-graveyard").on("click", graveyardCardClicked);
            if (GameData.graveyard.length > 0) {
                $("#graveyard-total").html(`(${GameData.graveyard.lenth})`);
            }
        },
        updateLibrary: function() {
            if (GameData.library.length > 0) {
                $("#library-total").html(`(${GameData.library.length})`);
            }
        }
    };

    const EventHandlers = {
        drawCard: function() {
            PlaytestControl.drawCard();
            ViewControl.updateHand();
            ViewControl.updateLibrary();
        },
        //FROM HAND
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
            ViewControl.updateLibrary();
        },
        handToBattlefield: function(cardIndex) {
            PlaytestControl.fromHandToBattlefield(cardIndex);
            ViewControl.updateBattlefield();
            ViewControl.updateLands();
            ViewControl.updateHand();
        },
        //FROM BATTLEFIELD
        battlefieldToHand: function(cardIndex) {
            PlaytestControl.fromBattlefieldToHand(cardIndex);
            ViewControl.updateBattlefield();
            ViewControl.updateHand();
        },
        battlefieldToExile: function(cardIndex) {
            PlaytestControl.fromBattlefieldToExile(cardIndex);
            ViewControl.updateBattlefield();
            ViewControl.updateExile();
        },
        battlefieldToLibrary: function(cardIndex) {
            PlaytestControl.fromBattlefieldToLibrary(cardIndex);
            ViewControl.updateBattlefield();
            ViewControl.updateLibrary();
        },
        battlefieldToGraveyard: function(cardIndex) {
            PlaytestControl.fromBattlefieldToGraveyard(cardIndex);
            ViewControl.updateBattlefield();
            ViewControl.updateGraveyard();
        },
        //FROM LANDS
        landsToHand: function(cardIndex) {
            PlaytestControl.fromLandsToHand(cardIndex);
            ViewControl.updateLands();
            ViewControl.updateHand();
        },
        landsToExile: function(cardIndex) {
            PlaytestControl.fromLandsToExile(cardIndex);
            ViewControl.updateLands();
            ViewControl.updateExile();
        },
        landsToGraveyard: function(cardIndex) {
            PlaytestControl.fromLandsToGraveyard(cardIndex);
            ViewControl.updateGraveyard();
            ViewControl.updateLands();
        },
        landsToLibrary: function(cardIndex) {
            PlaytestControl.fromLandsToLibrary(cardIndex);
            ViewControl.updateLands();
            ViewControl.updateLibrary();
        },
        //FROM GRAVEYARD AND EXILE
        exileToHand: function(cardIndex) {
            PlaytestControl.fromExileToHand(cardIndex);
            ViewControl.updateHand();
            ViewControl.updateExile();
        },
        graveyardToHand: function(cardIndex) {
            PlaytestControl.fromGraveyardToHand(cardIndex);
            ViewControl.updateHand();
            ViewControl.updateGraveyard();
        }
    };

//WHEN A CARD IN HAND IS CLICKED
    var handCardClick = function() {
        var splitArray = $(this).attr("id").split("-");
        var index = splitArray[2];
        var image = GameData.hand[parseInt(index)].imageUrl;
        $("#hand-to-graveyard").data("index", index);
        $("#hand-to-exile").data("index", index);
        $("#hand-to-battlefield").data("index", index);
        $("#hand-to-library").data("index", index);
        $("#pt-single-card-hand-image").attr("src", image);
    };

//WHEN A CARD ON BATTLEFIELD IS CLICKED
    var battlefieldCardClick = function() {
        var splitArray = $(this).attr("id").split("-");
        var index = splitArray[2];
        var image = GameData.battlefield[parseInt(index)].imageUrl;
        $("#battlefield-to-graveyard").data("index", index);
        $("#battlefield-to-exile").data("index", index);
        $("#battlefield-to-hand").data("index", index);
        $("#battlefield-to-library").data("index", index);
        $("#pt-single-card-battlefield-image").attr("src", image);
    };

//WHEN A CARD IN LANDS IS CLICKED
    var landsCardClick = function() {
        var splitArray = $(this).attr("id").split("-");
        var index = splitArray[2];
        var image = GameData.lands[parseInt(index)].imageUrl;
        $("#lands-to-graveyard").data("index", index);
        $("#lands-to-exile").data("index", index);
        $("#lands-to-hand").data("index", index);
        $("#lands-to-library").data("index", index);
        $("#pt-single-card-lands-image").attr("src", image);
    };

//WHEN A CARD IN GRAVEYARD IS CLICKED
    var graveyardCardClicked = function() {
        var splitArray = $(this).attr("id").split("-");
        var index = parseInt(splitArray[2]);
        EventHandlers.graveyardToHand(index);
    };

//WHEN A CARD IN EXILE IS CLICKED
    var exileCardClicked = function() {
        var splitArray = $(this).attr("id").split("-");
        var index = parseInt(splitArray[2]);
        EventHandlers.exileToHand(index);
    };

//PLAYTEST EVENT BINDINGS

    //FROM HAND MODAL BINDINGS
    $("#hand-to-battlefield").on("click", function() {
        var index = parseInt($(this).data("index"));
        EventHandlers.handToBattlefield(index);
    });
    $("#hand-to-library").on("click", function() {
        var index = parseInt($(this).data("index"));
        EventHandlers.handToLibrary(index);
    });
    $("#hand-to-exile").on("click", function() {
        var index = parseInt($(this).data("index"));
        EventHandlers.handToExile(index);
    });
    $("#hand-to-graveyard").on("click", function() {
        var index = parseInt($(this).data("index"));
        EventHandlers.handToGraveyard(index);
    });

    //FROM BATTLEFIELD BINDINGS
    $("#battlefield-to-hand").on("click", function() {
        var index = parseInt($(this).data("index"));
        EventHandlers.battlefieldToHand(index);
    });
    $("#battlefield-to-library").on("click", function() {
        var index = parseInt($(this).data("index"));
        EventHandlers.battlefieldToLibrary(index);
    });
    $("#battlefield-to-exile").on("click", function() {
        var index = parseInt($(this).data("index"));
        EventHandlers.battlefieldToExile(index);
    });
    $("#battlefield-to-graveyard").on("click", function() {
        var index = parseInt($(this).data("index"));
        EventHandlers.battlefieldToGraveyard(index);
    });

    //FROM LANDS BINDINGS
    $("#lands-to-hand").on("click", function() {
        var index = parseInt($(this).data("index"));
        EventHandlers.landsToHand(index);
    });
    $("#lands-to-library").on("click", function() {
        var index = parseInt($(this).data("index"));
        EventHandlers.landsToLibrary(index);
    });
    $("#lands-to-exile").on("click", function() {
        var index = parseInt($(this).data("index"));
        EventHandlers.landsToExile(index);
    });
    $("#lands-to-graveyard").on("click", function() {
        var index = parseInt($(this).data("index"));
        EventHandlers.landsToGraveyard(index);
    });

    //START GAME AND DRAW CARD EVENT BINDINGS
    $("#nav-menu-twoStart").on("click", GameData.startGame);
    $("#draw-card").on("click", EventHandlers.drawCard);
});
