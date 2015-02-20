module.exports = function ($timeout, CONFIG, reactTo, playerState) {
		'use strict';
		return {
			restrict: 'E',
			template: require('./controlbarTemplate.html'),
			link: function (scope, element, attrs) {
				var react = reactTo(scope);
				scope.cbIsVisible = false;
				scope.highlightForward = false;
				scope.highlightRewind = false;

				var resetHighlight = function () {
					scope.highlightForward = false;
					scope.highlightRewind = false;
				};

                //TODO: make it visible after down key pressed
				//keyboardService.on(keyboardService.keys.DOWN, function () {
				//	scope.$apply(function () {
				//			scope.cbIsVisible = !scope.cbIsVisible;
				//		});
				//	
				//});

				react(playerState, 'toggleRewind', function () {
					scope.highlightRewind = true;
					if (!scope.$$phase) {
						scope.$apply();
					}

					$timeout(resetHighlight, CONFIG.video.highlightTimeout);

				});

				react(playerState, 'toggleForward', function () {
					scope.highlightForward = true;
					if (!scope.$$phase) {
						scope.$apply();
					}

					$timeout(resetHighlight, CONFIG.video.highlightTimeout);
				});
			}
		};
	};
