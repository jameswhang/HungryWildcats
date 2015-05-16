Parse.initialize("LKT2P8orJ6egkhiXZqL7xAo1xkqqg8tkd8pzjbDE", "I7ilbHUSOpCSeRKuXwN8a9YBA7KZXk06J30tS00R");

$(document).ready(function() {
	$('h1').click(function() {
		alert("yikes!");
	});
	$('.menuChoices').hide();
	bindClickFunctions();
});

var bindClickFunctions = function() {
	$('.submit').click(function() {
		$('.userInput').fadeOut(400, showMenus($('.money').val()));
	});

	$('.restaurant').click(function() {
		showMenuFromRestaurant($('.money').val(), $(this).text());
	});
}

var showMenus = function(money) {
	var menu = Parse.Object.extend('Menu');
	var query = new Parse.Query(menu);
	query.find({
		success: function(results) {
			var results = generateRandom(results, money, 10),
				html = formatOutput(results);
			$('.menuChoices').append(html);
			bindClickFunctions();
		},
		error: function(error) {
			alert('shit');
		}
	});
	$('.menuChoices').fadeIn();
}

var showMenuFromRestaurant = function(money, name) {
	var menu = Parse.Object.extend('Menu');
	var query = new Parse.Query(menu);
	$('.menuChoices').empty();
	query = query.equalTo('Restaurant', name)
	query.find({
		success: function(results) {
			var results = generateRandom(results, money, 10),
				html = formatOutput(results);
			$('.menuChoices').append(html);
			bindClickFunctions();
		},
		error: function(error) {
			alert('shit');
		}
	});

	$('.menuChoices').fadeIn();
}


var generateRandom = function(menus, money, num) {
	var menus = shuffle(menus),
		numResults = menus.length,
		results = [];

	for (var i = 0; i < numResults && results.length < num; i++) {
		var tempRes = {},
			aMenu = menus[i],
			mPrice = aMenu._serverData.Price,
			mName = aMenu._serverData.Name,
			mRes = aMenu._serverData.Restaurant;

		if (mPrice > money) {
			continue; // can't afford..
		} else {
			tempRes['name'] = mName;
			tempRes['quantity'] = Math.floor(money / mPrice);
			tempRes['where'] = mRes;
			results.push(tempRes);
		}
	}
	return results;
}

var formatOutput = function(menus) {
	var numResults = menus.length,
		html = '',
		item;
	if (numResults == 0) {
		html += '<div class="menu">Nothing for you to eat!</div>';
	} else {
		for (var i = 0; i < numResults; i++) {
			item = menus[i];
			html += '<div class="menu">';
			html += 'You can eat ' + item['quantity'] + ' of ' +
				item['name'] + ' from <span class="restaurant">' + item['where'];
			html += '</span></div>';
		}
	}
	return html;
}

var shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}