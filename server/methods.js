function generateBaseMap() {
	return [
		"kill",
		"team1", "team1", "team1", "team1", "team1", "team1", "team1", "team1",
		"team2", "team2", "team2", "team2", "team2", "team2", "team2", "team2",
		"neutral", "neutral", "neutral", "neutral", "neutral", "neutral", "neutral"
	];
}

Meteor.methods({
	"createGame": function(team1Str, team2Str, frequent, infrequent) {
		var words = Words.find().fetch().map(function(value) {
			return value.word;
		});
		shuffle(words);

		team1Players = parsecsv(team1Str);
		team2Players = parsecsv(team2Str);
		otherPlayers = shuffle(parsecsv(frequent)).concat(shuffle(parsecsv(infrequent)));
		for (index in otherPlayers) {
			var whichTeam = team1Players.length > team2Players.length;
			if (team1Players.length == team2Players.length) {
				whichTeam = Math.random() > 0.5;
			}
			if (whichTeam) {
				team2Players.push(otherPlayers[index]);
			} else {
				team1Players.push(otherPlayers[index]);
			}
		}

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
			"secondPlayerTeam": firstPlayerTeam === "team1" ? "team2" : "team1",
			"team1Players": team1Players,
			"team2Players": team2Players
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
