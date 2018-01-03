NimGame = (function() {
	var game_status;
	const default_config = {
		"player1": {
			type: "player"
		},
		"player2": {
			type: "ai"
		},
		"stones": [-1, -1, -1],
		"offensive": "player1"
	};

	var AI = function(stones) {
		var xor = 0;
		var action_pile = 0;
		var number_of_most_stones = 0;
		var action_pile_stones = 0;
		for (var i = 0; i < stones.length; i++) {
			xor ^= stones[i];
			if (stones[i] > number_of_most_stones) {
				action_pile = i;
				number_of_most_stones = stones[i];
			}
		}
		var action;
		if (xor === 0) {
			action_pile_stones = Math.floor(Math.random()*number_of_most_stones);
			action = {
				"pile_index": action_pile,
				"stones": action_pile_stones,
				"message": "Uhh... I'm not sure if I can win."
			}
		} else {
			for (var i = 0; i < stones.length; i++) {
				if ((stones[i] ^ xor) < stones[i]) {
					action_pile = i;
					action_pile_stones = stones[i] ^ xor;
					break;
				}
			}
			action = {
				"pile_index": action_pile,
				"stones": action_pile_stones,
				"message": "I think I'm the winner :D"
			}
		}
		return action;
	};

	var get_action = function(player) {
		return new Promise(function(resolve, reject) {
			if (game_status[player]["type"] === "ai") {
				resolve(AI(game_status["stones"]));
			} else if (game_status[player]["type"] === "player") {
				var button = document.getElementById('button');
				var pile_index = document.getElementById('pile_index');
				var stones = document.getElementById('stones');
				button.onclick = function() {
					resolve({
						"pile_index": parseInt(pile_index.value),
						"stones": parseInt(stones.value),
						"message": ""
					})
				};
			}
		});
	};

	var turn = function(player) {
		// draw();
		if (game_status[player] === undefined) {
			throw "game error";
		} else {
			console.log(player + "'s turn");
			console.log(game_status["stones"]);
			get_action(player).then(function(action) {
				if (game_status["stones"][action["pile_index"]] === undefined) {
					throw "pile index undefined";
				}
				if (game_status["stones"][action["pile_index"]] < action["stones"]) {
					throw "stones larger than expected";
				}
				game_status["stones"][action["pile_index"]] = action["stones"];
				console.log(action["message"]);
				var finished = true;
				for (var i = 0; i < game_status["stones"].length; i++) {
					if (game_status["stones"][i] > 0) {
						finished = false;
					}
				}
				if (finished) {
					game_status["winner"] = player;
					console.log("winner is " + game_status["winner"] + "!");
					return;
				} else {
					if (game_status["turn"] === "player1") {
						game_status["turn"] = "player2";
					} else if (game_status["turn"] === "player2") {
						game_status["turn"] = "player1";
					}
					turn(game_status["turn"]);
				}
			});
		}
		
	};

	return {
		init: function(config) {
			
			game_status = default_config;
			if (config !== undefined) {
				for (var key in default_config) {
					if (config[key] !== undefined) {
						game_status[key] = config[key];
					}
				}
			}
			game_status["turn"] = game_status["offensive"];
			for (var i = 0; i < game_status["stones"].length; i++) {
				if (game_status["stones"][i] === -1) {
					game_status["stones"][i] = Math.floor(Math.random()*10+1)
				}
			}
			
			console.log(game_status);
			
		},
		start: function() {
			turn(game_status["turn"]);
			// drawfinish();
		}
	};

	
})();
NimGame.init();
NimGame.start();