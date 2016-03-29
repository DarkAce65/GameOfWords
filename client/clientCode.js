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
				if(this.map) {
					classes = "clickable " + this.map[i * 5 + j];
				}
				table += '<td class="' + classes + '" data-index="' + (i * 5 + j) + '">' + this.words[i * 5 + j] + '</td>';
			}
			table += "</tr>";
		}
		table += "</table";
		return table;
	}
});