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
		var gameInfo = {secret: Random.id(5)};
		gameInfo._id = Games.insert({
			"words": words.slice(0, 25),
			"secret": gameInfo.secret,
			"map": generateMap(),
			"actions": []
		});
		return gameInfo;
	},
	
	'addAction': function(_id, secret, dataIndex) {
		var obj = {};
		obj["actions." + dataIndex] = 
			Games.findOne({_id: _id, secret: secret}).map[dataIndex];
		Games.update({_id: _id, secret: secret}, {$set: obj});
	},
});
