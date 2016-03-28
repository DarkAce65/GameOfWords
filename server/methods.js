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
		return Games.insert({
			"words": words.slice(0, 25),
			"map": generateMap(),
			"actions": []
		});
	}
});