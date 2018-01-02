

function NimGame() {

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

	this.get_player_action = function() {
		return new Promise(function (resolve, reject) {
			var button = document.getElementById('button');
			var pile_index = document.getElementById('pile_index');
			var stones = document.getElementById('stones');
			console.log(button);
			button.onclick() = function() {
				resolve({
					"pile_index": parseInt(pile_index.value),
					"stones": parseInt(stones.value),
					"message": ""
				})
			};
		});
	};

	this.AI = function(stones) {
		var xor = 0;
		var pile_with_most_stones = 0;
		var number_of_most_stones = 0;
		for (var i = 0; i < stones.length; i++) {
			xor ^= stones[i];
			if (stones[i] > number_of_most_stones) {
				pile_with_most_stones = i;
				number_of_most_stones = stones[i];
			}
		}
		var action;
		if (xor === 0) {
			action = {
				"pile_index": pile_with_most_stones,
				"stones": number_of_most_stones - 1,
				"message": "Uhh... I'm not sure if I can win."
			}
		} else {
			action = {
				"pile_index": pile_with_most_stones,
				"stones": number_of_most_stones ^ xor,
				"message": "I think I'm the winner :D"
			}
		}
		return action;
	};

	this.player = function() {
		this.get_player_action().then(function(action) {
			return action;
		});
	};

	var turn = function(player) {
		// draw();
		if (game_status[player] === undefined) {
			throw "game error";
		} else {
			get_action(game_status).then(function(action) {
				if (game_status["stones"][action["pile_index"]] === undefined) {
					throw "game error";
				}
				if (game_status["stones"][action["pile_index"]] <= action["stones"]) {
					throw "game error";
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
				}
			});
		}/*if (game_status[player]["type"] === "ai") {
			action = this.AI(game_status["stones"]);
		} else if (game_status[player]["type"] === "player") {
			console.log(this);
			action = this.player();
		} else {
			throw "game error";
		}*/
		
	};

	this.init = function(config) {
		
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
		
	};

	this.start = function() {
		while (game_status["winner"] === undefined) {
			turn(game_status["turn"]);
		}
		console.log("winner is " + game_status["winner"] + "!");
		// drawfinish();
	};

	return this;
}

game = NimGame();
game.init();
game.start();