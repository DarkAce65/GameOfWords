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
		var table = '<table id="wordTable">';
		for(var i = 0; i < 5; i++) {
			table += "<tr>";
			for(var j = 0; j < 5; j++) {
				var classes = "";
				var team = this.map ? this.map[i * 5 + j] : this.actions[i * 5 + j];
				var word = this.actions[i * 5 + j] ? '' : this.words[i * 5 + j];
				var title = this.words[i * 5 + j];
				if (team) {
					classes = team;
				}
				if (this.actions[i * 5 + j]) {
					classes = classes + ' reveal'
				}
				else if (this.map) {
					classes = classes + ' clickable';
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
	'click .clickable': function(event) {
		var title = $(event.target).attr('title');
		if (confirm('Reveal ' + title + ' to plebians?')) {
			var dataIndex = $(event.target).attr('data-index');
			Meteor.call('addAction', this._id, this.secret, dataIndex);
		}
	}
});
