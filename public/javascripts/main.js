$(document).ready(function(){ 
//MATERIALIZE COMPONENT INITIALIZERS
    $('.modal').modal();
    $("#pt-scry-modal").modal({dismissible: false});
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


//PLAYTESTING FUNCTIONS
    const GameData = {
        //THIS IS THE GAME DATA BEING MANIPULATED
        deckId: null,
        userId: null,
        library: [],
        hand: [],
        battlefield: [],
        lands: [],
        graveyard:[],
        exile:[],
        replay: false,
        scry: [],
        battlefieldTapped: [],
        landsTapped: [],
        cardViewTypes: ["library", "hand", "battlefield", "graveyard", "exile", "scry", "lands"],
        //STARTS THE GAME
        startGame: function() {
            //EMPTY VIEW ARRAYS
            GameData.cardViewTypes.forEach(function(viewType) {
                GameData[viewType] = [];
            });
            GameData.landsTapped = [];
            GameData.battlefieldTapped = [];
            //IF THE GAME IS NOT A REPLAY
            if (GameData.replay === false) {
                //PARSE THE USER/DECK IDS
                var splitArray = $("#nav-menu-twoStart").attr("href").split(",");
                //SET THE IDS
                GameData.deckId = splitArray[1];
                GameData.userId = splitArray[0].slice(1);
            }
            //GET THE RANDOMIZED DECK
            $.get(`/1/decks/${GameData.deckId}/deckToPlay`)
                .then(function(data) {
                    //SET REPLAY TO TRUE FOR FUTURE STARTS
                    GameData.replay = true;
                    //SET THE LIBRARY
                    GameData.library = data;
                    //SET UP TAPPED ARRAYS
                    for (var i = 0; i < GameData.library.length; i++) {
                        GameData.battlefieldTapped.push(false);
                        GameData.landsTapped.push(false);
                    }
                    //UPDATE VIEWS
                    ViewControl.updateCards();    
                });
        } 
    };

    const PlaytestControl = {
        //DRAW A CARD     
        drawCard: function() {          
                GameData.hand.push(GameData.library[0]);
                GameData.library.splice(0, 1);
        },
        //MOVE FROM ONE ZONE TO ANOTHER
        fromTo: function(from, to, index) {
            //IF TO IS BATTLEFIELD, CHECK TO SEE IF IT IS A LAND OR NOT
            if (to === "battlefield") {
                for (var i = 0; i < GameData[from][index].types.length; i++) {
                    if (GameData[from][index].types[i] === "Land") {
                        GameData.lands.push(GameData[from][index]);
                        GameData[from].splice(index, 1);
                        return;
                    }
                }
                GameData.battlefield.push(GameData[from][index]);
                GameData[from].splice(index, 1);

            }
            else if (to === "librarybottom") {
                GameData.library.push(GameData[from][index]);
                GameData[from].splice(index, 1);
            }
            else if (to === "library") {
                GameData[to].unshift(GameData[from][index]);
                GameData[from].splice(index, 1);
            }
            else {
                GameData[to].push(GameData[from][index]);
                GameData[from].splice(index, 1);
            }
            if (from === "battlefield" || from === "lands") {
                GameData[`${from}Tapped`].splice(index, 1);
                GameData[`${from}Tapped`].push(false);
            }
        },
        //SHUFFLE LIBRARY
        shuffle: function() {
            var origArray = GameData.library;
            var newArray = [];
            while (origArray.length > 0) {
                var index = Math.floor(Math.random() * origArray.length);
                newArray.push(origArray[index]);
                origArray.splice(index, 1);
            }
            GameData.library = newArray;
        },
        //SCRY
        scry: function(amount) {
            var scryCards = GameData.library.slice(0, amount);
            GameData.library.splice(0, amount);
            scryCards.forEach(function(card) {
                GameData.scry.push(card);
            });
        },
        //TAP
        tap: function(type, index) {
            if (GameData[type + "Tapped"][index] === true) {
                GameData[type + "Tapped"][index] = false;
            }
            else {
                GameData[type + "Tapped"][index] = true;
            }
        }
    };

    const ViewControl = {
        //UPDATE ALL CARD VIEWS
        updateCards: function() {
                var size = 0;
                if ($(window).width() > 992) {
                    size = 6; 
                }
                else if ($(window).width() > 600) {
                    size = 4;
                }
                else {
                    size = 3;
                }
            GameData.cardViewTypes.forEach(function(type) {
                $(`#${type}`).empty();
                for(var i = 0; i < GameData[type].length; i++) {
                    if (i % size === 0) {
                        console.log(i % size);
                        $(`#${type}`).append("<div style='height: 1px; width: 100%;' class='col s12'></div>");
                    }   
                    $(`#${type}`).append(`<a class='pt-sorted-card' id='pt-${type}-${i}' href='#pt-single-card-modal'><div style='position: relative; margin-top: 5%;' class='col s4 m3 l2'><img class='col s12 modal-action' src=${GameData[type][i].imageUrl}></div></a>`);
                }
                if (GameData[type].length > 0) {
                    $(`#${type}-total`).html(`(${GameData[type].length})`);
                }
                else {
                    $(`#${type}-total`).html("(0)");
                }
            });
            $(".pt-sorted-card").on("click", cardClicked);
            if (GameData.scry.length === 0) {
                $("#pt-scry-modal").modal("close");
            }
            $("#hand").children().addClass("modal-close");
            $("#library").children().addClass("modal-close");
            $("#battlefield a div").append(`<a class='btn col l4 m4 s5 grey darken-3 tap-button' style='position: absolute; bottom: 50%; right: 50%; href='#'>TAP</a>`);
            $("#lands a div").append(`<a class='btn col l4 m4 s5 grey darken-3 tap-button' style='position: absolute; bottom: 50%; right: 50%;' href='#'>TAP</a>`);
            $(".tap-button").on("click", function(event) {
                event.stopPropagation();
                var splitArray = $(this).parent().parent().attr("id").split("-");
                var index = splitArray[2];
                var type = splitArray[1];
                PlaytestControl.tap(type, index);
                ViewControl.updateCards();
            });
            GameData.battlefield.forEach(function(card, index) {
                if (GameData.battlefieldTapped[index] === true) {
                    $(`#pt-battlefield-${index} div`).addClass("tapped");
                }
                else {
                    $(`#pt-battlefield-${index} div`).removeClass("tapped");
                }
            });
            GameData.lands.forEach(function(card, index) {
                if (GameData.landsTapped[index] === true) {
                    $(`#pt-lands-${index} div`).addClass("tapped");
                }
                else {
                    $(`#pt-lands-${index} div`).removeClass("tapped");
                }
            });
        }
    };

    const EventHandlers = {
        //DRAW CARD BUTTON
        drawCard: function() {
            if (GameData.library.length > 0) {
                PlaytestControl.drawCard();
                ViewControl.updateCards();
            }
        },
        //ALL MODAL BUTTONS
        modalButton: function(from, to, index) {
            PlaytestControl.fromTo(from, to, index);
            ViewControl.updateCards();
        },
        //SCRY BUTTON
        scryX: function() {
            var amount = $("#scry-amount").val();
            $("#scry-amount").val(1);
            PlaytestControl.scry(amount);
            ViewControl.updateCards();
        },
        tap: function(type, index) {
            PlaytestControl.tap(type, index);
            ViewControl.updateCards;
        }
    };


//WHEN A CARD IS CLICKED
    var cardClicked = function() {
        //PARSE THE TO AND FROM
        var splitArray = $(this).attr("id").split("-");
        var index = splitArray[2];
        var fromType = splitArray[1];
        //PARSE THE IMAGE
        var image = GameData[fromType][parseInt(index)].imageUrl;
        //FOR EACH VIEW TYPE
        GameData.cardViewTypes.forEach(function(type) {
            //REMOVE THE HIDE CLASS
            $(`#to-${type}`).removeClass("hide");
            //SET THE INDEX DATA
            $(`#to-${type}`).data("index", index);
            //SET THE FROM DATA
            $(`#to-${type}`).data("from", fromType);
            //ADD HIDE CLASS TO BUTTON OF SAME TYPE
            if (type === fromType) {
                $(`#to-${type}`).addClass("hide");
            }
        });
        //SET THINGS FOR LIBRARY BOTTOM BUTTON
        $(`#to-librarybottom`).data("index", index);
        $(`#to-librarybottom`).data("from", fromType);
        //SET THE IMAGE
        $("#pt-single-card-image").attr("src", image);
    };

//PLAYTEST EVENT BINDINGS
    $(".button-for-modal").on("click", function() {
        var toZone = $(this).attr("id").split("-")[1];
        var fromZone = $(this).data("from");
        var index = parseInt($(this).data("index"));
        EventHandlers.modalButton(fromZone, toZone, index);
    });
    $("#scry-button").on("click", EventHandlers.scryX);
    $("#nav-menu-twoStart").on("click", GameData.startGame);
    $("#draw-card").on("click", EventHandlers.drawCard);
    $("#shuffle-button").on("click", PlaytestControl.shuffle);
});
