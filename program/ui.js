UI = (function() {

	var canvas = document.getElementById("game_board");
	var ctx = canvas.getContext("2d");

	return {
		gameConfig: function() {
			return new Promise(function(resolve, reject) {
				resolve({
					"player1": {
						"type": "player"
					},
					"player2": {
						"type": "ai"
					},
					"stones": [-1, -1, -1]
				});
			});
		}
	};
})();
