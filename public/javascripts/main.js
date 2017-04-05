$(document).ready(function(){ 
//MATERIALIZE COMPONENT INITIALIZERS
    $('.modal').modal();
    $("#pt-scry-modal").modal({dismissible: false});
    $('.carousel').carousel();
    $(".nav-extended.Start").append('<div class="nav-content" style="margin-bottom: 10px;"><ul class="tabs tabs-transparent"><li class="tab"><a href="#battlefield-tab">Battlefield</a></li><li class="tab"><a href="#graveyard-tab">Graveyard <span id="graveyard-total">(0)</span></a></li><li class="tab"><a href="#exile-tab">Exile <span id="exile-total">(0)</span></a></li></ul></div>');
    $('ul.tabs').tabs();
//SAMPLE HAND GENERATOR
    var sampleHandCount = 0;
    $("#sample-hand-trigger").on("click", function() {
    	var data = $(this).data("store");
    	var array = data.split(",");
    	for (var i = 0; i < 7; i++) {
    		var cardIndex = Math.floor(Math.random() * array.length);
    		var card = array[cardIndex];
    		$(`#sh-card-${i}`).attr("src", card);
    		array.splice(cardIndex, 1);
    	}
        if (sampleHandCount % 2 === 0) {
        setTimeout(function(){$("#sample-hand").click()}, 1);
        }
    });


//PLAYTESTING FUNCTIONS
    const GameData = {
        //THIS IS THE GAME DATA BEING MANIPULATED
        replay: false,
        deckId: null,
        userId: null,
        library: [],
        hand: [],
        graveyard:[],
        exile:[],
        scry: [],
        battlefield: [],
        lands: [],
        tokens: [],
        battlefieldTapped: [],
        landsTapped: [],
        tokensTapped: [],
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
        },
        untap: function() {
            GameData.battlefieldTapped.forEach(function(card, index, array) {
                array[index] = false;
            });
            GameData.landsTapped.forEach(function(card, index, array) {
                array[index] = false;
            });
        },
        addToken: function(name, power, toughness) {
            var token = {
                name: name,
                power: power,
                toughness: toughness
            };
            GameData.tokens.push(token);
        },
        removeToken: function(index) {
            GameData.tokens.splice(index, 1);
        }
    };

    const ViewControl = {
        //UPDATE ALL CARD VIEWS
        updateCards: function() {
            //CHECK VIEWPORT SIZE AND SET COLUMN # PER ROW
                var columnNum = 0;
                if ($(window).width() > 992) {
                    columnNum = 6; 
                }
                else if ($(window).width() > 600) {
                    columnNum = 4;
                }
                else {
                    columnNum = 3;
                }
            //FOR EACH VIEW TYPE
            GameData.cardViewTypes.forEach(function(type) {
                //EMPTY THE VIEW
                $(`#${type}`).empty();
                //THEN FOR EACH CARD IN THAT VIEW TYPE
                for(var i = 0; i < GameData[type].length; i++) {
                    //IF THE ROW IS FULL
                    if (i !== 0 && i % columnNum === 0) {
                        //APPEND A DIV TO SEPARATE THE NEXT ROW
                        $(`#${type}`).append("<div style='height: 1px; width: 100%;' class='col s12'></div>");
                    } 
                    //THEN APPEND THE CARD.  
                    $(`#${type}`).append(`<a class='pt-sorted-card' id='pt-${type}-${i}' href='#pt-single-card-modal'><div style='position: relative;' class='col s4 m3 l2'><img class='col s12 modal-action' src=${GameData[type][i].imageUrl}></div></a>`);
                }
                //IF THE TYPE ISN'T EMPTY
                if (GameData[type].length > 0) {
                    //THEN UPDATE THE DISPLAY TO THE CURRENT TOTAL OF CARDS IN THAT VIEW
                    $(`#${type}-total`).html(`(${GameData[type].length})`);
                }
                else {
                    //OTHERWISE SET THE DISPLAY TO 0
                    $(`#${type}-total`).html("(0)");
                }
            });
            //AFTER ALL THE CARDS ARE RENDERED TO THE DOM, ATTACH THE EVENT LISTENER
            $(".pt-sorted-card").on("click", cardClicked);
            //IF THE SCRY VIEW IS EMPTY
            if (GameData.scry.length === 0) {
                //CLOSE IT
                $("#pt-scry-modal").modal("close");
            }
            //MAKE THE HAND AND LIBRARY CARDS CLOSE THEIR RESPECTIVE MODALS WHEN CLICKED
            $("#hand").children().addClass("modal-close");
            $("#library").children().addClass("modal-close");
            //ADD THE TAP BUTTON TO BATTLEFIELD CARDS
            $("#battlefield a div").append(`<a class='btn col l4 m4 s5 tap-button teal black-text' style='position: absolute; bottom: 50%; right: 50%; href='#'>TAP</a>`);
            $("#lands a div").append(`<a class='btn col l4 m4 s5 tap-button teal black-text' style='position: absolute; bottom: 50%; right: 50%;' href='#'>TAP</a>`);
            //ADD THE EVENT LISTENER TO THE TAP BUTTON
            $(".tap-button").on("click", function(event) {
                event.stopPropagation();
                var splitArray = $(this).parent().parent().attr("id").split("-");
                var index = splitArray[2];
                var type = splitArray[1];
                PlaytestControl.tap(type, index);
                ViewControl.updateCards();
                ViewControl.updateTokens();
            });
            //UPDATE TAPPED AND UNTAPPED CARDS
            GameData.battlefield.forEach(function(card, index) {
                //BY CHECKING FOR THE TAPPED VALUES OF CORRESPONDING INDICES
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
        },
        updateTokens: function() {
            GameData.tokens.forEach(function(card, index) {
                $("#battlefield").append(`<a class='pt-token' id='pt-tokens-${index}' href='#'><div style='position: relative;' class='col s4 m3 l2'><img class='col s12 modal-action' src="/images/cardBack.jpg"></div></a>`)
            });
        }
    };

    const EventHandlers = {
        //DRAW CARD BUTTON
        drawCard: function() {
            if (GameData.library.length > 0) {
                PlaytestControl.drawCard();
                ViewControl.updateCards();
                ViewControl.updateTokens();
            }
        },
        //ALL MODAL BUTTONS
        modalButton: function(from, to, index) {
            PlaytestControl.fromTo(from, to, index);
            ViewControl.updateCards();
            ViewControl.updateTokens();
        },
        //SCRY BUTTON
        scryX: function() {
            var amount = $("#scry-amount").val();
            $("#scry-amount").val(1);
            PlaytestControl.scry(amount);
            ViewControl.updateCards();
            ViewControl.updateTokens();
        },
        tap: function(type, index) {
            PlaytestControl.tap(type, index);
            ViewControl.updateCards();
            ViewControl.updateTokens();
        },
        untapAll: function() {
            PlaytestControl.untap();
            ViewControl.updateCards();
            ViewControl.updateTokens();
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
    $("#untap-button").on("click", EventHandlers.untapAll);
    $("#scry-button").on("click", EventHandlers.scryX);
    $("#nav-menu-twoStart").on("click", GameData.startGame);
    $("#draw-card").on("click", EventHandlers.drawCard);
    $("#shuffle-button").on("click", PlaytestControl.shuffle);
});
