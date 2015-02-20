module.exports = function () {
	'use strict';
	return {
		restrict: 'E',
		template: require('./topbarTemplate.html'),
		link: function (scope, element, attrs) {
			scope.tbIsVisible = false;
            //TODO: make it visible after up key
			//keyboardService.on(keyboardService.keys.UP, function () {
			//		scope.$apply(function () {
			//			scope.tbIsVisible = !scope.tbIsVisible;
			//		})
			//});
		}
	};
};
