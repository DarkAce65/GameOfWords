Meteor.publish("gameData", function(gameId, secret) {
	var game = Games.findOne(gameId);
	if(!game) {
		throw new Meteor.Error("game-not-found", "Game not found");
	}
	if(game.secret === secret) {
		return Games.find(gameId);
	}
	return Games.find(gameId, {
		fields: {
			words: 1,
			actions: 1
		}
	});
});

Words.remove({});
for(var i = 0; i < wordlist.length; i++) {
	Words.insert({"word": wordlist[i]});
}