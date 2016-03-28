Router.route("/", {
	name: "home",
	template: "home"
});

Router.route("/game/:_id", {
	name: "game",
	template: "game",
	waitOn: function() {
		return Meteor.subscribe("gameData", this.params._id);
	},
	data: function() {
		return Games.findOne(this.params._id);
	}
});

Router.route("/game/:_id/:secret", {
	name: "gameOracle",
	template: "game",
	waitOn: function() {
		return Meteor.subscribe("gameData", this.params._id, this.params.secret);
	},
	data: function() {
		return Games.findOne(this.params._id);
	}
});