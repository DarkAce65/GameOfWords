shuffle = function(array) { // Fisher–Yates Shuffle
	var m = array.length, t, i;
	while(m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

parsecsv = function(inputString) {
  if (!inputString) {
    return [];
  }
  var temp = inputString.trim().split(',');
  temp = temp.filter(function(str) {
    return !!str;
  });
  return temp.map(function(str) {
    return str.trim();
  });
}

toTeamString = function(array) {
  if (!array || array.length < 1) return "";
  var output = array[0];
  if (array.length > 1) output = output + " - ";
  for (i = 1; i < array.length; i++) {
    if (i > 1) output = output + ", ";
    output = output + array[i];
  }
  return output;
}
