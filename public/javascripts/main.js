$(document).ready(function(){   
    $('.modal').modal();
    $('.carousel').carousel();
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
  });
