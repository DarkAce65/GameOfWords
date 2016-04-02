function generateMap() {
	var map = [
		"kill",
		"team1", "team1", "team1", "team1", "team1", "team1", "team1", "team1", "team1",
		"team2", "team2", "team2", "team2", "team2", "team2", "team2", "team2",
		"neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral"
	];
	return shuffle(map);
}

Meteor.methods({
	"createGame": function() {
		var words = Words.find().fetch().map(function(value) {
			return value.word;
		});
		shuffle(words);

		var revealed = [];
		for(var i = 0; i < 25; i++) {
			revealed.push(false);
		}

		var gameInfo = {
			secret: Random.id(5)
		};
		gameInfo._id = Games.insert({
			"secret": gameInfo.secret,
			"map": generateMap(),
			"board": {
				"words": words.slice(0, 25),
				"revealed": revealed
			},
			"actions": []
		});
		return gameInfo;
	},
	'addAction': function(_id, secret, dataIndex) {
		var game = Games.findOne({_id: _id, secret: secret});
		var set = {};
		set["board.revealed." + dataIndex] = game.map[dataIndex];

		Games.update({_id: _id, secret: secret}, {
			$set: set,
			$push: {
				"actions": {
					"word": game.board.words[dataIndex],
					"team": game.map[dataIndex]
				}
			}
		});
	},
});
