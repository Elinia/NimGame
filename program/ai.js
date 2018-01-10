MyAI = (function() {
	return {
		action: function(stones, resolve, reject) {
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
			if (xor === 0) {
				action_pile_stones = Math.floor(Math.random() * number_of_most_stones);
				setTimeout(function() {
					resolve({
						"pile_index": action_pile,
						"stones": action_pile_stones,
						"message": "AI: Uhh... I'm not sure if I can win."
					});
				}, 500);
			} else {
				for (var i = 0; i < stones.length; i++) {
					if ((stones[i] ^ xor) < stones[i]) {
						action_pile = i;
						action_pile_stones = stones[i] ^ xor;
						break;
					}
				}
				setTimeout(function() {
					resolve({
						"pile_index": action_pile,
						"stones": action_pile_stones,
						"message": "AI: I think I'm the winner :D"
					});
				}, 500);
			}
		}
	};
})();