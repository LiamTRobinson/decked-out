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
        library: [],
        hand: [],
        battlefield: [],
        lands: [],
        graveyard:[],
        exile:[],
        replay: false,
        scry: [],
        cardViewTypes: ["library", "hand", "battlefield", "graveyard", "exile", "scry", "lands"],
        //STARTS THE GAME
        startGame: function() {
            GameData.cardViewTypes.forEach(function(viewType) {
                GameData[viewType] = [];
            });
            if (GameData.replay === false) {
                var splitArray = $("#nav-menu-twoStart").attr("href").split(",");
                GameData.deckId = splitArray[1];
                GameData.userId = splitArray[0].slice(1);
            }
            $.get(`/1/decks/${GameData.deckId}/deckToPlay`)
                .then(function(data) {
                    GameData.library = data; 
                    GameData.replay = true;
                    ViewControl.updateCards();    
                });
        } 
    };

    const PlaytestControl = {     
        drawCard: function() {
            GameData.hand.push(GameData.library[0]);
            GameData.library.splice(0, 1);
        },
        fromTo: function(from, to, index) {
            if (to === "battlefield") {
                for (var i = 0; i < GameData[from][index].types.length; i++) {
                    if (GameData[from][index].types[i] === "Land") {
                        console.log(GameData[from][index])
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
        }
    };

    const ViewControl = {
        updateCards: function() {
            GameData.cardViewTypes.forEach(function(type) {
                if (type !== "library") {
                    $(`#${type}`).empty();
                    for(var i = 0; i < GameData[type].length; i++) {
                            $(`#${type}`).append(`<a class='pt-sorted-card' id='pt-${type}-${i}' href='#pt-single-card-modal'><img style='margin-top:5%' class='col s3 m3 l2 modal-action modal-close' src=${GameData[type][i].imageUrl}></a>`);
                    }
                }
                $("#lands").empty();
                for (var i = 0; i < GameData.lands.length; i++) {
                    $("#lands").append(`<a class='pt-sorted-card' id='pt-lands-${i}' style='margin-top: 5%;' href='#pt-single-card-modal'><img class='col s3 m3 l2' src=${GameData.lands[i].imageUrl}></a>`);
                }
                $(".pt-sorted-card").on("click", cardClicked);
                if (GameData[type].length > 0) {
                    $(`#${type}-total`).html(`(${GameData[type].length})`);
                }
                else {
                    $(`#${type}-total`).html("(0)");
                }
            });
        }       
    };

    const EventHandlers = {
        drawCard: function() {
            PlaytestControl.drawCard();
            ViewControl.updateCards();
        },
        modalButton: function(from, to, index) {
            PlaytestControl.fromTo(from, to, index);
            ViewControl.updateCards();
        }
    };


//WHEN A CARD IS CLICKED
    var cardClicked = function() {
        var splitArray = $(this).attr("id").split("-");
        var index = splitArray[2];
        var fromType = splitArray[1];
        var image = GameData[fromType][parseInt(index)].imageUrl;
        if (fromType === "scry") {
            $("#pt-single-card-image").attr("src", image);
            GameData.cardViewTypes.forEach(function(type) {
                $(`#to-${type}`).removeClass("hide");
               if (type !== "library") {
                $(`#to-${type}`).addClass("hide");
               }
            });
            $(`#to-librarybottom`).data("index", index);
            $(`#to-librarybottom`).data("from", fromType);
            $(`#to-library`).data("index", index);
            $(`#to-library`).data("from", fromType);
        }
        else {
            GameData.cardViewTypes.forEach(function(type) {
                $(`#to-${type}`).removeClass("hide");
                $(`#to-${type}`).data("index", index);
                $(`#to-${type}`).data("from", fromType);
                if (type === fromType) {
                    $(`#to-${type}`).addClass("hide");
                }
            });
            $(`#to-librarybottom`).data("index", index);
            $(`#to-librarybottom`).data("from", fromType);
            $("#pt-single-card-image").attr("src", image);
        }
    }

//PLAYTEST EVENT BINDINGS
    
    //MODAL BUTTON EVENT BINDINGS
    $(".button-for-modal").on("click", function() {
        var toZone = $(this).attr("id").split("-")[1];
        var fromZone = $(this).data("from");
        var index = parseInt($(this).data("index"));
        EventHandlers.modalButton(fromZone, toZone, index);
    })

    //OTHER BUTTON EVENT BINDINGS
    $("#nav-menu-twoStart").on("click", GameData.startGame);
    $("#draw-card").on("click", EventHandlers.drawCard);
});
