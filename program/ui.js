UI = (function() {

	var canvas = document.getElementById("game_board");
	var ctx = canvas.getContext("2d");

	var player1_select = document.getElementById("player1");
	var player2_select = document.getElementById("player2");
	var pile_count_select = document.getElementById("pile_count");
	var stones_selects_span = document.getElementById("stones_selects");

	var new_pile_select = function(index) {
		var pile_select = document.createElement("select");
		pile_select.id = "pile_" + index;
		var stone_count_option = document.createElement("option");
		stone_count_option.value = "-1";
		stone_count_option.text = "random";
		pile_select.add(stone_count_option);
		for (var i = 1; i <= 10; ++i) {
			stone_count_option = document.createElement("option");
			stone_count_option.value = i;
			stone_count_option.text = i;
			pile_select.add(stone_count_option);
		}
		return pile_select;
	};

	var update_stones_selects_span = function() {
		var pile_count = parseInt(pile_count_select.value);
		stones_selects_span.innerHTML = "";
		for (var i = 0; i < pile_count; ++i) {
			stones_selects_span.appendChild(new_pile_select(i));
		}
	};
	pile_count_select.onchange = update_stones_selects_span;
	update_stones_selects_span();

	var get_stones = function() {
		var pile_count = parseInt(pile_count_select.value);
		var stones = [];
		for (var i = 0; i < pile_count; ++i) {
			var pile_select = document.getElementById("pile_" + i);
			stones.push(parseInt(pile_select.value));
		}
		return stones;
	}

	var get_mouse_pos_on_canvas = function(x, y) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: x - rect.left,
			y: y - rect.top
		};
	};

	var get_move_stones = function(stones, mouse_pos) {
		var pile_index = Math.floor(mouse_pos.y / 100);
		var stone_index = Math.floor((mouse_pos.x - 13) / 75);
		if (pile_index >= stones.length || pile_index < 0) {
			return "illegal";
		}
		if (stone_index > stones[pile_index] || stone_index < 0) {
			return "illegal";
		}
		return {
			pile_index: pile_index,
			stone_index: stone_index
		};
	};

	var draw_background = function() {
		ctx.fillStyle = "lightblue";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};

	var draw_piles = function() {
		ctx.fillStyle = "grey";
		for (var i = 0; i < 5; ++i) {
			ctx.fillRect(0, 45 + i * 100, canvas.width, 10);
		}
	};

	var draw_stones = function(stones) {
		ctx.strokeStyle = "black";
		ctx.fillStyle = "brown";
		for (var i = 0; i < stones.length; ++i) {
			for (var j = 0; j < stones[i]; ++j) {
				ctx.beginPath();
				ctx.arc(50 + j * 75, 50 + i  * 100, 35, 0, 2 * Math.PI);
				ctx.stroke();
				ctx.fill();
			}
		}
	};

	var draw_turn = function(turn) {
		ctx.font = "30px Arial";
		ctx.fillStyle = "black";
		ctx.fillText(turn + "'s turn", 20, 530);
	};

	var draw_message = function(message) {
		ctx.font = "30px Arial";
		ctx.fillStyle = "black";
		ctx.fillText(message, 300, 530);
	};

	var draw_move_stones = function(stones, mouse_pos) {
		draw_stones(stones);
		var stone_pos = get_move_stones(stones, mouse_pos);
		if (stone_pos === "illegal") {
			return;
		}
		ctx.fillStyle = "yellow";
		for (var i = stone_pos.stone_index; i < stones[stone_pos.pile_index]; ++i) {
			ctx.beginPath();
			ctx.arc(50 + i * 75, 50 + stone_pos.pile_index  * 100, 35, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.fill();
		}
	};

	var draw_winner = function(winner) {
		draw_background();
		ctx.font = "80px Arial";
		ctx.fillStyle = "white";
		ctx.fillText(winner + " is the winner", 35, 200);
		ctx.fillText("Congratulations!", 100, 350);
	};

	var draw_again = function() {
		ctx.font = "80px Arial";
		ctx.fillStyle = "blue";
		ctx.fillText("Play again", 200, 500);
		canvas.onmouseenter = function() {
			ctx.fillStyle = "red";
			ctx.fillText("Play again", 200, 500);
		};
		canvas.onmouseleave = function() {
			ctx.fillStyle = "blue";
			ctx.fillText("Play again", 200, 500);
		};
		canvas.onmousemove = function() {};
		canvas.onclick = function() {
			config_mode();
		};
	};

	var config_mode = function() {
		draw_background();
		ctx.font = "bold 100px Arial";
		ctx.fillStyle = "red";
		ctx.fillText("Start Nim Game", 18, 330);
		canvas.onmouseenter = function() {
			ctx.fillStyle = "red";
			ctx.fillText("Start Nim Game", 18, 330);
		};
		canvas.onmouseleave = function() {
			ctx.fillStyle = "blue";
			ctx.fillText("Start Nim Game", 18, 330);
		};
		canvas.onmousemove = function() {};
		canvas.onclick = function() {
			NimGame.start({
				"player1": {
					"type": player1_select.value
				},
				"player2": {
					"type": player2_select.value
				},
				"stones": get_stones()
			});
			game_mode();
		};
	};

	var game_mode = function() {
		//ctx.clearRect(0, 0, canvas.width, canvas.height);
		canvas.onmouseenter = function() {};
		canvas.onmouseleave = function() {};
	};

	config_mode();

	return {
		drawGameBoard: function(game_status) {
			draw_background();
			draw_piles();
			draw_stones(game_status["stones"]);
			draw_turn(game_status["turn"]);
			draw_message(game_status["message"]);
		},
		getPlayerAction: function(stones, resolve, reject) {
			canvas.onmousemove = function(e) {
				draw_move_stones(stones, get_mouse_pos_on_canvas(e.clientX, e.clientY));
			};
			canvas.onclick = function(e) {
				var stone_pos = get_move_stones(stones, get_mouse_pos_on_canvas(e.clientX, e.clientY));
				if (stone_pos === "illegal") {
					return;
				}
				console.log(stone_pos);
				resolve({
					"pile_index": stone_pos.pile_index,
					"stones": stone_pos.stone_index,
					"message": ""
				});
			};
		},
		drawFinish: function(winner) {
			draw_winner(winner);
			draw_again();
		}
	};
})();
