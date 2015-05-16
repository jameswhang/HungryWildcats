Parse.initialize("LKT2P8orJ6egkhiXZqL7xAo1xkqqg8tkd8pzjbDE", "I7ilbHUSOpCSeRKuXwN8a9YBA7KZXk06J30tS00R");

$(document).ready(function() {
	$(".menuChoices").hide();
});

$(".submit").click(function() {
	$(".userInput").fadeOut(400, showMenus($(".money").val()));
});

var showMenus = function(money) {
	var menu = Parse.Object.extend("Menu");
	var query = new Parse.Query(menu);
	query.find({
		success: function(results) {
			var numResults = results.length;
			for (var i = 0; i < numResults; i++) {
				var aMenu = results[i];
				var mPrice = aMenu._serverData.Price;
				var mName = aMenu._serverData.Name;
				var mRes = aMenu._serverData.Restaurant;

				//console.log(money);
				//console.log(mPrice);
				//console.log(mName);
				//console.log(mRes);
			}
		},
		error: function(error) {
			alert("shit");
		}
	})

	$(".menuChoices").fadeIn();
}