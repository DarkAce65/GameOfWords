$.Velocity.RegisterEffect("showWord", {
	defaultDuration: 1500,
	calls: [
		[{"colorAlpha": 0}, 1, {delay: 750}]
	],
	reset: {"colorAlpha": 1}
});

Template.banner.events({
	"click h1": function(e) {
		Router.go("home");
	},
	"click #condensed": function() {
		document.body.classList.toggle("condensed");
	}
});

Template.home.events({
	"submit .create-game": function(event) {
		event.preventDefault();
		var team1 = event.target.team1.value;
		var team2 = event.target.team2.value;
		var frequent = event.target.frequent.value;
		var infrequent = event.target.infrequent.value;
		Meteor.call("createGame", team1, team2, frequent, infrequent, function(error, value) {
			if(error) {
				console.log(error);
			}
			else {
				Router.go("gameOracle", {"_id": value._id, "secret": value.secret});
			}
		});
	}
});

Template.game.onRendered(function() {
	var clipboard = new Clipboard(".clipboardBtn");
	clipboard.on("success", function(e) {
		e.clearSelection();

		$(e.trigger).tooltip("show");
		setTimeout(function() {
			$(e.trigger).tooltip("hide");
		}, 1000);
	});
});

Template.game.helpers({
	"wordTable": function() {
		var table = '<table id="wordTable"';
		if(this.secret) {
			table += ' class="oracle"';
		}
		table += ">";
		for(var i = 0; i < 5; i++) {
			table += "<tr>";
			for(var j = 0; j < 5; j++) {
				var classes = "";
				var team = this.map ? this.map[i * 5 + j] : this.board.revealed[i * 5 + j];
				var word = this.board.revealed[i * 5 + j] ? "&nbsp;" : this.board.words[i * 5 + j];
				var title = this.board.words[i * 5 + j];
				if(team) {
					classes = team;
				}
				if(this.board.revealed[i * 5 + j]) {
					classes += " revealed"
				}
				else if(this.map) {
					classes += " clickable";
				}
				table += '<td class="' + classes
					+ '" data-index="' + (i * 5 + j)
					+ '" title="' + title
					+ '">' +  word + '</td>';
			}
			table += "</tr>";
		}
		table += "</table>";
		return table;
	},
	"firstPlayerRemainingCount": function() {
		var guessed = 0;
		for (var i = 0; i < this.actions.length; i++) {
			if (this.actions[i].team == this.firstPlayerTeam) {
				guessed++;
			}
		}
		return this.firstPlayerCount - guessed;
	},
	"secondPlayerRemainingCount": function() {
		var guessed = 0;
		for (var i = 0; i < this.actions.length; i++) {
			if (this.actions[i].team == this.secondPlayerTeam) {
				guessed++;
			}
		}
		return this.secondPlayerCount - guessed;
	},
	"neutralRemainingCount": function() {
		var guessed = 0;
		for (var i = 0; i < this.actions.length; i++) {
			if (this.actions[i].team == "neutral") {
				guessed++;
			}
		}
		return 7 - guessed;
	},
	"showTeams": function() {
		return this.team1Players.length > 0 || this.team2Players.length > 0;
	},
	"firstPlayerTeamPlayers": function() {
		if (this.firstPlayerTeam === "team1") {
			return toTeamString(this.team1Players);
		} else {
			return toTeamString(this.team2Players);
		}
	},
	"secondPlayerTeamPlayers": function() {
		if (this.firstPlayerTeam === "team1") {
			return toTeamString(this.team2Players);
		} else {
			return toTeamString(this.team1Players);
		}
	}
});

Template.game.events({
	"click .clickable": function(event) {
		var _id = this._id;
		var secret = this.secret;
		var dataIndex = $(event.target).attr("data-index");
		swal({
			title: "Reveal " + $(event.target).attr("title") + " to plebians?",
			showCancelButton: true,
			confirmButtonColor: "#5e9a4e",
			confirmButtonText: "Yes",
			cancelButtonText: "No"
		}, function(confirm){
			if(confirm) {
				Meteor.call("revealTile", _id, secret, dataIndex);
			}
		});
	},
	"click .revealed": function(event) {
		var word = $(event.target).attr("title");
		$(event.target).html(word);
		$(event.target).velocity("stop").velocity("reverse", {"duration": 100}).velocity("showWord", {
			complete: function(element) {
				$(element).html("&nbsp;");
			}
		});
	}
});
