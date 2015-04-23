module.exports = function() {
	'use strict';
	return {
		restrict: 'E',
		template: require('./ytv_topbarTemplate.html'),
		link: function(scope, element, attrs) {
			scope.tbIsVisible = false;
//			if (yetu) {
//				yetu.onActionUp = function() {
//					scope.$apply(function() {
//						scope.tbIsVisible = !scope.tbIsVisible;
//					})
//				}
//			}
		}
	};
};
