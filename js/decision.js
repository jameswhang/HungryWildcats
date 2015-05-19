$(document).ready(function() {
	$('.menuChoices').hide();
	bindClickFunctions();
});

var bindClickFunctions = function() {
	$('.submit').click(function() {
		var money = $('.money').val();
		if (isNormalInteger(money)) {
			$('.about').fadeOut();
			$('.userInput').fadeOut(400, showMenus(money));
		} else {
			alert('You can only put in numbers!');
		}
	});

	$('.more').click(function() {
		$('.home').fadeOut(400);
		$('.more').fadeOut(400, showMenus($('.money').val()));
	});

	$('.home').click(function() {
		location.reload();
	})

	$('.restaurant').click(function() {
		$('.more').fadeOut(400);
		$('.home').fadeOut(400);
		showMenuFromRestaurant($('.money').val(), $(this).text());
	});
}

var showMenus = function(money) {
	var menu = Parse.Object.extend('EvanstonMenuExtended');
	var query = new Parse.Query(menu);
	query = query.limit(1000);
	//query.lessThanOrEqualTo("ItemPrice", money);
	query.find({
		success: function(results1) {
			console.log(results1);
			if (results1.length == 1000) {
				query.skip(1000).limit(1000).find({
					success: function(results2) {
						var results = generateRandom(results1.concat(results2), money, 10),
							html = formatOutput(results);
							html += showMoreButton();
							html += showHomeButton();
						$('.menuChoices').append(html);
						bindClickFunctions();
					},
					error: function(error) {
						alert('Oops, we hiccuped!');
					}
				})
			} else {
				var results = generateRandom(results, money, 10),
					html = formatOutput(results);
					html += showMoreButton();
				$('.menuChoices').append(html);
				bindClickFunctions();
			}
		},
		error: function(error) {
			alert('Oops, we hiccuped!');
		}
	});
	$('.menuChoices').fadeIn();
}

var showHomeButton = function() {
	return '<button class="btn btn-primary home">Home</button>';
}

var showMoreButton = function() {
	return '<button class="btn btn-primary more">More</button>';
}

var showMenuFromRestaurant = function(money, name) {
	var menu = Parse.Object.extend('EvanstonMenuExtended');
	var query = new Parse.Query(menu);
	$('.menuChoices').empty();
	query.equalTo('RestaurantName', name)
	query.find({
		success: function(results) {
			var results = generateRandom(results, money, 10),
				html = formatOutput(results);
				html += showHomeButton();
			$('.menuChoices').append(html);
			bindClickFunctions();
		},
		error: function(error) {
			alert('Oops, we hiccuped!');
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
			mPrice = aMenu._serverData.ItemPrice,
			mName = aMenu._serverData.ItemName,
			mDesc = aMenu._serverData.ItemDesc,
            mImage = aMenu._serverData.image_url,
			mRes = aMenu._serverData.RestaurantName;
			//console.log(aMenu);

		if (mPrice > money) {
			continue; // can't afford..
		} else {
			tempRes['name'] = mName;
			tempRes['quantity'] = Math.floor(money / mPrice);
			tempRes['where'] = mRes;
			tempRes['desc'] = mDesc;
            tempRes['img'] = mImage;
			results.push(tempRes);
		}
	}
	return results;
}

var renderMenu = function(item) {
    return '<div class="btn-feature"><div class="col-md-3"><img class="menu-img" src=' + item['img'] + '></img></div><div class="col-md-9"><span class="menu-name">' + item['name'] + '</span><span class="menu-quantity">X' + item['quantity'] + '</span></div></div>';
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
            html += renderMenu(item);
		}
	}
	return html;
}

var isNormalInteger = function(str) {
    var re = /(?:\d*\.)?\d+/g;
    var m = str.match(re);
    if (m == null) {
        return false;
    } else {
        return true;
    }
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
