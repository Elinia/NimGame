
function NimGame() {

	var player1, player2;
	var number_of_piles, number_of_stones;
	const default_config = {
		"player1": {
			type: "player"
		},
		"player2": {
			type: "ai"
		},
		"number_of_piles": 3,
		"number_of_stones": [-1, -1, -1, -1, -1],
		"offensive": "player1"
	};

	this.init = function(config) {
		game_status = default_config;
		for (var key in default_config) {
			if (config[key] !== undefined) {
				game_status[key] = config[key];
			}
		}
		if (game_status["number_of_stones"].length < game_status["number_of_piles"]) {
			throw "config error";
		}
		game_status["turn"] = game_status["offensive"];
		for (var i = 0; i < game_status["number_of_piles"]; i++) {
			if (game_status["number_of_stones"][i] === -1) {
				game_status["number_of_stones"][i] = Math.floor(Math.random()*10+1)
			}
		}
		console.log(game_status);
	};

	this.play = function() {

	};

	return this;
}