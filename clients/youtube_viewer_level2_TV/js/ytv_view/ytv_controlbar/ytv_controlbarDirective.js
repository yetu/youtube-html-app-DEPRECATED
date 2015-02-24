module.exports = function ($timeout, CONFIG, reactTo, ytv_playerState) {
    'use strict';
    return {
        restrict: 'E',
        template: require('./ytv_controlbarTemplate.html'),
        link: function (scope, element, attrs) {
            var react = reactTo(scope);
            scope.cbIsVisible = false;
            scope.highlightForward = false;
            scope.highlightRewind = false;

            var resetHighlight = function () {
                scope.highlightForward = false;
                scope.highlightRewind = false;
            };

            if (yetu) {
                yetu.onActionDown = function () {
                    scope.$apply(function () {
                        scope.cbIsVisible = !scope.cbIsVisible;
                    });
                };
            }

            react(ytv_playerState, 'toggleRewind', function () {
                scope.highlightRewind = true;
                if (!scope.$$phase) {
                    scope.$apply();
                }

                $timeout(resetHighlight, CONFIG.video.highlightTimeout);

            });

            react(ytv_playerState, 'toggleForward', function () {
                scope.highlightForward = true;
                if (!scope.$$phase) {
                    scope.$apply();
                }

                $timeout(resetHighlight, CONFIG.video.highlightTimeout);
            });
        }
    }
};