Words.remove({});
for(var i = 0; i < 100; i++) {
	Words.insert({"word": i + " " + Fake.word()});
}

Meteor.publish("gameData", function(gameId, secret) {
	var game = Games.findOne(gameId);
	if(!game) {
		throw new Meteor.Error("game-not-found", "Game not found");
	}
	if(game.secret === secret) {
		return Games.find();
	}
	return Games.find(gameId, {
		fields: {
			words: 1,
			actions: 1
		}
	});
});