NimGame = (function() {
	var game_status;
	const default_config = {
		"player1": {
			"type": "player"
		},
		"player2": {
			"type": "AI"
		},
		"stones": [-1, -1, -1],
		"message": ""
	};

	var get_action = function(player) {
		return new Promise(function(resolve, reject) {
			if (game_status[player]["type"] === "AI") {
				MyAI.action(game_status["stones"],  resolve, reject);
			} else if (game_status[player]["type"] === "player") {
				UI.getPlayerAction(game_status["stones"], resolve, reject);
			}
		});
	};

	var next_turn = function() {
		if (game_status["turn"] === "player1") {
			turn("player2");
		} else if (game_status["turn"] === "player2") {
			turn("player1");
		} else {
			throw "turn bug";
		}
	};

	var game_finished = function() {
		for (var i = 0; i < game_status["stones"].length; i++) {
			if (game_status["stones"][i] > 0) {
				return false;
			}
		}
		return true;
	};

	var turn = function(player) {
		game_status["turn"] = player;
		console.log(player + "'s turn");
		console.log(game_status["stones"]);
		UI.drawGameBoard(game_status);
		if (game_status[player] === undefined) {
			throw "game error";
		} else {
			get_action(player).then(function(action) {
				if (action === undefined) {
					throw "action undefined";
				}
				if (game_status["stones"][action["pile_index"]] === undefined) {
					console.log(action["pile_index"]);
					throw "pile index out of range";
				}
				if (action["stones"] >= game_status["stones"][action["pile_index"]] || action["stones"] < 0) {
					throw "stones out of range";
				}

				game_status["stones"][action["pile_index"]] = action["stones"];
				game_status["message"] = action["message"];
				//console.log(player + ": " + action["message"]);
				
				if (game_finished()) {
					game_status["winner"] = player;
					//console.log("winner is " + game_status["winner"] + "!");
					UI.drawFinish(player);
					return;
				} else {
					next_turn();
				}
			});
		}
		
	};

	return {
		start: function(config) {
			game_status = JSON.parse(JSON.stringify(default_config));
			if (config !== undefined) {
				for (var key in default_config) {
					if (config[key] !== undefined) {
						game_status[key] = config[key];
					}
				}
			}
			for (var i = 0; i < game_status["stones"].length; i++) {
				if (game_status["stones"][i] === -1) {
					game_status["stones"][i] = Math.floor(Math.random()*10+1)
				}
			}
			//console.log(game_status);

			turn("player1");
		}
	};

	
})();