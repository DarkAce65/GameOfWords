function shuffle(array) { // Fisher–Yates Shuffle
	var m = array.length, t, i;
	while(m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

function generateMap() {
	var map = [];

}

Template.home.events({
	"click #create": function(e) {
		var words = Words.find().fetch().map(function(value) {
			return value.word;
		});
		shuffle(words);
		Games.insert({
			"words": words.slice(25),
			"map": []
		});
	}
});