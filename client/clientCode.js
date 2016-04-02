$.Velocity.RegisterEffect("showWord", {
	defaultDuration: 1500,
	calls: [
		[{"colorAlpha": 0}, 1, {delay: 750}]
	],
	reset: {"colorAlpha": 1}
});

Template.home.events({
	"click #create": function(e) {
		Meteor.call("createGame", function(error, value) {
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
				Meteor.call("addAction", _id, secret, dataIndex);
			}
		});
	},
	"click .revealed": function(event) {
		var word = $(event.target).attr("title");
		$(event.target).html(word);
		$(event.target).velocity("stop").velocity("reverse", {"duration": 100}).velocity("showWord", {
			complete: function(element) {
				$(element).html("");
			}
		});
	}
});
