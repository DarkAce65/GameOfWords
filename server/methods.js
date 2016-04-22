function generateBaseMap() {
	return [
		"kill",
		"team1", "team1", "team1", "team1", "team1", "team1", "team1", "team1",
		"team2", "team2", "team2", "team2", "team2", "team2", "team2", "team2",
		"neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral"
	];
}

Meteor.methods({
	"createGame": function() {
		var words = Words.find().fetch().map(function(value) {
			return value.word;
		});
		shuffle(words);

		var map = generateBaseMap();
		var firstPlayerTeam = Math.random() > 0.5 ? "team1" : "team2";
		map.push(firstPlayerTeam);
		shuffle(map);

		var revealed = [];
		for(var i = 0; i < 25; i++) {
			revealed.push(false);
		}

		var gameInfo = {
			secret: Random.id(5)
		};
		gameInfo._id = Games.insert({
			"secret": gameInfo.secret,
			"map": map,
			"board": {
				"words": words.slice(0, 25),
				"revealed": revealed
			},
			"actions": [],
			"firstPlayerCount": 9,
			"firstPlayerTeam": firstPlayerTeam,
			"secondPlayerCount": 8,
			"secondPlayerTeam": firstPlayerTeam === "team1" ? "team2" : "team1"
		});
		return gameInfo;
	},
	"revealTile": function(_id, secret, dataIndex) {
		var game = Games.findOne({_id: _id, secret: secret});
		var set = {};
		set["board.revealed." + dataIndex] = game.map[dataIndex];

		Games.update({_id: _id, secret: secret}, {
			$set: set,
			$addToSet: {
				"actions": {
					"word": game.board.words[dataIndex],
					"team": game.map[dataIndex]
				}
			}
		});
	},
});
