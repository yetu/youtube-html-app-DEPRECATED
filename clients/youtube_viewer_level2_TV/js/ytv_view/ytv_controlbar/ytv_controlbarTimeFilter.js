module.exports = function () {
	'use strict';

	return function (input) {
		if (input === null || typeof input === 'undefined') {
			return "";
		}

		input = input.toFixed(0);

		var sekunden = input % 60;
		var minuten = (input - sekunden) / 60;

		if (sekunden < 10)
			sekunden = "0" + sekunden;

		return minuten + ":" + sekunden;
	};
};
