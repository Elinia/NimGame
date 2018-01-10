NimGame = (function() {
	var game_status;
	const default_config = {
		"player1": {
			"type": "player"
		},
		"player2": {
			"type": "ai"
		},
		"stones": [-1, -1, -1]
	};

	var get_action = function(player) {
		return new Promise(function(resolve, reject) {
			if (game_status[player]["type"] === "ai") {
				resolve(MyAI.action(game_status["stones"]));
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
		// draw();
		if (game_status[player] === undefined) {
			throw "game error";
		} else {
			get_action(player).then(function(action) {
				if (action === undefined) {
					throw "action undefined";
				}
				if (game_status["stones"][action["pile_index"]] === undefined) {
					throw "pile index out of range";
				}
				if (action["stones"] >= game_status["stones"][action["pile_index"]] || action["stones"] < 0) {
					throw "stones out of range";
				}

				game_status["stones"][action["pile_index"]] = action["stones"];
				console.log(player + ": " + action["message"]);
				
				if (game_finished()) {
					game_status["winner"] = player;
					console.log("winner is " + game_status["winner"] + "!");
					return;
				} else {
					next_turn();
				}
			});
		}
		
	};

	return {
		init: function() {
			UI.gameConfig().then(function(config) {
				NimGame.start(config);
			});
		},
		start: function(config) {
			game_status = default_config;
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
			console.log(game_status);

			turn("player1");
		}
	};

	
})();
NimGame.init();
/*NimGame.start({
	"player1": {
		"type": "player"
	},
	"player2": {
		"type": "ai"
	},
	"stones": [-1, -1, -1],
	"offensive": "player1"
});*/