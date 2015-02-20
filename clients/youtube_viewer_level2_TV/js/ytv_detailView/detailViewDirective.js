module.exports = function () {
	'use strict';

	return {
		restrict: 'E',
		template: require('./detailViewTemplate.html'),
		link: function (scope, element, attrs) {
			scope.currentIndex = 0;
			scope.info = {
				duration: 0,
				actTime: 0,
				percentage: 0,
				isPlaying: true
			};
		}
	};
};
