(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./js/app');
},{"./js/app":2}],2:[function(require,module,exports){
var youtubeViewerApp = angular.module('youtubeViewerApp',
	[
		'ngRoute',
		'ngResource',
		'pascalprecht.translate',
		'reactTo',
        require('./ytv_detailInformation').name,
        require('./ytv_detailView').name
	]);

youtubeViewerApp.config(function ($provide, $routeProvider, $translateProvider, $httpProvider, $locationProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/', {
			template: require('./mainTemplate.html')
		})
		.otherwise({
			redirectTo: '/'
		});

	$translateProvider.translations('en', {

	});

	$translateProvider.preferredLanguage('en');


});

youtubeViewerApp.run(function(detailInformationService){
    detailInformationService.data = {
        feed: {
            entries: [{
                containsVideo: true,
                imageUrl: "https://i.ytimg.com/vi/vr5n_ZOZ6E8/maxresdefault.jpg",
                title: "Can We Genetically Improve Intelligence?",
                truncatedTitle: "Can We Genetically Improve...",
                videourl: "vr5n_ZOZ6E8"
            },
                {
                    containsVideo: true,
                    imageUrl: "https://i.ytimg.com/vi/vr5n_ZOZ6E8/maxresdefault.jpg",
                    title: "Can We Genetically Improve Intelligence?",
                    truncatedTitle: "Can We Genetically Improve...",
                    videourl: "vr5n_ZOZ6E8"
                }],
            title: "AsapSCIENCE",
            truncatedTitle: "AsapSCIENCE - "
            
        }
        
    }
});

youtubeViewerApp.constant('CONFIG',{
    video: {
        highlightTimeout: 250,
        FAST_FORWARD: 20,
        FAST_REWIND: -20
    }
})


},{"./mainTemplate.html":3,"./ytv_detailInformation":5,"./ytv_detailView":12}],3:[function(require,module,exports){
module.exports = "<detail-view></detail-view>\n";

},{}],4:[function(require,module,exports){
/**
 * Service to share the data for the opened detailed view between
 * Dashboard and Detail view.
 * @Class DetailService
 */
module.exports = function () {
	'use strict';
	this.data;
	this.dataFeedEntriesIndex = 0; //default index for videos inside a playlist, later overwritten by user selection
	this.isEnhancedFocussedView;
	this.enhancedFocussedViewIsLoading;
	this.enhancedFocussedViewHasError;
};

},{}],5:[function(require,module,exports){
module.exports = angular.module('ytv_detailInformation',[])
    .service('detailInformationService', require('./detailInformationService'));

},{"./detailInformationService":4}],6:[function(require,module,exports){
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

},{"./controlbarTemplate.html":7}],7:[function(require,module,exports){
module.exports = "<div class=\"controlbar-overlay-container\" style=\"transform: translate(0px, 400px);\" ng-style=\"{'transform': cbIsVisible ? 'translate(0px,0px)':'translate(0px, 400px)'}\">\n  <div class=\"controlbar-container\">\n    <div id=\"btn_rewind\" ng-class=\"{highlight: highlightRewind }\"></div>\n    <div id=\"btn_pause\" ng-show=\"info.isPlaying\"></div>\n    <div id=\"btn_play\" ng-show=\"!info.isPlaying\"></div>\n    <div id=\"btn_forward\" ng-class=\"{highlight: highlightForward }\"></div>\n\n    <div id=\"actTime\">{{info.actTime | controlbarTimeFilter}}</div>\n    <progress id=\"progressbar\" max=\"100\" value=\"{{info.percentage}}\"></progress>\n    <div id=\"duration\">{{ info.duration | controlbarTimeFilter }}</div>\n  </div>\n  <div class=\"controlbar-title\">\n    {{data.feed.entries[currentIndex].title}}\n  </div>\n</div>\n";

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
/**
 * @class DetailViewController
 */
module.exports = function (detailInformationService, $scope, $rootScope, $timeout, reactTo) {
    'use strict';
    var react = reactTo($scope);

    var setKeyHandler = function () {

        //hasKeysForVideoBound = true;
        //
        ////TODO: set these keys to tv-message-client
        ////TODO: set as well up, down, left, right
        //playKeyId = keyboardService.on(keyboardService.keys.PLAY, function () {
        //    playerState.togglePlay = !playerState.togglePlay;
        //});
        //forwardKeyId = keyboardService.on(keyboardService.keys.FORWARD, function () {
        //    playerState.toggleForward = !playerState.toggleForward;
        //});
        //rewindKeyId = keyboardService.on(keyboardService.keys.REWIND, function () {
        //    playerState.toggleRewind = !playerState.toggleRewind;
        //});
    };

    setKeyHandler();
    
    $scope.data = detailInformationService.data;
    $scope.currentIndex = detailInformationService.dataFeedEntriesIndex;
    
    console.log($scope.data);

    react(detailInformationService, 'dataFeedEntriesIndex', function (n, o) {
        if (n != o) {
            $scope.currentIndex = n;
        }
    });

};

},{}],10:[function(require,module,exports){
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

},{"./detailViewTemplate.html":11}],11:[function(require,module,exports){
module.exports = "<div class=\"detail-view-wrapper\"\n     ng-controller=\"DetailViewCtrl\"\n     class=\"is-visible\">\n    <!--\n     style=\"{{data.fromHeaderStyle}} background-color: {{data['detail-view-background-color']}};-->\n  <div detail-view-youtube\n       class=\"detail-view-content\">\n  </div>\n  <preview-overlay></preview-overlay>\n  <topbar></topbar>\n  <controlbar></controlbar>\n</div>\n";

},{}],12:[function(require,module,exports){
module.exports = angular.module('ytv_detailView', ['ytv_detailInformation', 'pascalprecht.translate'])
    .service('playerState', require('./playerState'))
    .controller('DetailViewCtrl', require('./detailViewController'))
    .directive('detailView', require('./detailViewDirective'))
    .directive('detailViewYoutube', require('./youtube/detailViewYoutube'))
    .directive('previewOverlay', require('./preview/previewOverlayDirective'))
    .directive('topbar', require('./topbar/topbarDirective'))
    .directive('controlbar', require('./controlbar/controlbarDirective'))
    .filter('controlbarTimeFilter', require('./controlbar/controlbarTimeFilter'))
;

},{"./controlbar/controlbarDirective":6,"./controlbar/controlbarTimeFilter":8,"./detailViewController":9,"./detailViewDirective":10,"./playerState":13,"./preview/previewOverlayDirective":14,"./topbar/topbarDirective":16,"./youtube/detailViewYoutube":18}],13:[function(require,module,exports){
module.exports = function () {
	this.togglePlay = false;
	this.toggleForward = false;
	this.toggleRewind = false
};

},{}],14:[function(require,module,exports){
module.exports = function (detailInformationService) {
    'use strict';

    var translateFactor = 700,
        gridWidth = 500;

    var calcTranslate = function (index) {
        var value = translateFactor - (index * gridWidth);
        return value;
    };

    return {
        restrict: 'E',
        template: require('./previewOverlayTemplate.html'),
        controller: function ($scope) {
            $scope.selectedIndex = $scope.currentIndex;
            var oldIndex = $scope.currentIndex;
            $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';

            //TODO: apply actions on left, back, right
            //var backKeyId = keyboardService.on(keyboardService.keys.BACK, function () {
            //    $scope.selectedIndex = oldIndex;
            //});
            //
            //var rightKeyId = keyboardService.on(keyboardService.keys.RIGHT, function () {
            //    var nextIndex = $scope.selectedIndex + 1;
            //    if (nextIndex >= $scope.data.feed.entries.length) {
            //        console.info("no further feed entry... nothing to do");
            //        return;
            //    } else {
            //        $scope.selectedIndex = nextIndex;
            //        $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';
            //    }
            //});
            //
            //var leftKeyId = keyboardService.on(keyboardService.keys.LEFT, function () {
            //    var nextIndex = $scope.selectedIndex - 1;
            //    if (nextIndex < 0) {
            //        console.info("no further feed entry... nothing to do");
            //        return;
            //    } else {
            //        $scope.selectedIndex = nextIndex;
            //        $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';
            //    }
            //});

            $scope.$on('$destroy', function () {
                var selectedIndex = $scope.selectedIndex;
                console.info("selectedIndex: " + selectedIndex);
                detailInformationService.dataFeedEntriesIndex = selectedIndex;
                //keyboardService.unbind(keyboardService.keys.LEFT, leftKeyId);
                //keyboardService.unbind(keyboardService.keys.RIGHT, rightKeyId);
                //keyboardService.unbind(keyboardService.keys.BACK, backKeyId);
            });
        }
    };
};

},{"./previewOverlayTemplate.html":15}],15:[function(require,module,exports){
module.exports = "<div class=\"preview-overlay-container\">\n  <div class=\"preview-overlay-title\">{{data.name}}</div>\n  <div class=\"preview-grid-container\" ng-style=\"{'transform': translate}\">\n    <div ng-repeat=\"item in data.feed.entries\" class=\"preview-grid\"\n         ng-style=\"item.imageUrl && item.imageUrl !== '' && {'background-image':'url('+item.imageUrl+')', 'opacity' : selectedIndex===$index ? '1' : '0.3'}\">\n      <img ng-if=\"!item.imageUrl && data.logo\" class=\"preview-logo\" ng-src=\"{{data.logo}}\" alt=\"logo\">\n\n      <div class=\"preview-grid-content\" ng-if=\"!item.imageUrl\">\n        {{item.title}}\n      </div>\n    </div>\n  </div>\n  <div class=\"active-element\"></div>\n  <div class=\"active-element-title\">{{data.feed.entries[selectedIndex].title}}</div>\n</div>";

},{}],16:[function(require,module,exports){
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

},{"./topbarTemplate.html":17}],17:[function(require,module,exports){
module.exports = "<div class=\"topbar-overlay-container\" style=\"transform: translate(0px, -200px);\" ng-style=\"{'transform': tbIsVisible ? 'translate(0px,0px)':'translate(0px, -200px)'}\">\n  <div class=\"topbar-title-container\">\n    <div class=\"topbar-title-typo-bold\">{{'TOPBAR_SIMILAR' | translate}}</div>\n    <div class=\"topbar-title-typo\">{{'TOPBAR_WATCH_LATER' | translate}}</div>\n    <div class=\"topbar-title-typo\">{{'TOPBAR_SHARE' | translate}}</div>\n    <div class=\"topbar-menu-icon\"></div>\n  </div>\n</div>\n";

},{}],18:[function(require,module,exports){
module.exports =  function ($interval, CONFIG, reactTo, playerState, $timeout) {
		'use strict';

		var player;
		// 2. This code loads the IFrame Player API code asynchronously.
		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		var timeupdater;
		return {
			restrict: 'A',
			template: require('./detailViewYoutubeTemplate.html'),
			link: function (scope, element, attrs) {
				var react = reactTo(scope);
				var updateTime = function () {
					if (typeof player === 'undefined' || player === null) {
						return;
					}

					if (player && player.getCurrentTime) {
						var actTime = player.getCurrentTime();
						scope.info.actTime = actTime;
						scope.info.percentage = Math.round(actTime / scope.info.duration * 100);

						if (!scope.$$phase) {
							scope.$apply();
						}
					}
				};

				var onStateChange = function (event) {
					if (typeof player === 'undefined' || player === null || scope.info.isYoutube === false) {
						return;
					}
					if (player.getPlayerState() === YT.PlayerState.PLAYING) {
						scope.info.duration = player.getDuration();
						scope.info.isPlaying = true;
						if (!scope.$$phase) {
							scope.$apply();
						}
						timeupdater = $interval(updateTime, 500);
					} else {
						scope.info.isPlaying = false;
						if (!scope.$$phase) {
							scope.$apply();
						}
						$interval.cancel(timeupdater);
					}
				};

				var stop = function () {
					if (typeof player === 'undefined' || player === null) {
						return;
					}
					player.pauseVideo();
				};

				var vidplay = function () {
					if (typeof player === 'undefined' || player === null) {
						return;
					}
					if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
						player.playVideo();
					} else {
						player.pauseVideo();
					}
				};

				var skip = function (value) {
					if (typeof player === 'undefined' || player === null) {
						return;
					}
					player.pauseVideo();
					$interval.cancel(timeupdater);

					var time = player.getCurrentTime();
					var newTime = time + value;
					if (newTime < 0) {
						newTime = 0;
					} else if (newTime > scope.info.duration) {
						newTime = scope.info.duration;
						player.seekTo(newTime, true);
						scope.info.actTime = newTime;
						scope.info.percentage = 100;
						if (!scope.$$phase) {
							scope.$apply();
						}
					} else {
						player.seekTo(newTime, true);
						player.playVideo();
					}
				};

				var loadPlayerAndVideo = function () {
					if (typeof player === 'undefined' || player === null) {
						player = new YT.Player('player', {
							height: '1080',
							width: '1920',
							playerVars: {'autoplay': 1, 'controls': 0, 'showinfo': 0},
							videoId: scope.data.feed.entries[scope.currentIndex].videourl,
							events: {
								'onStateChange': onStateChange
							}
						});
					}
                    if (player.getVideoUrl && player.getVideoUrl().indexOf(scope.data.feed.entries[scope.currentIndex].videourl) === -1) {
                        player.loadVideoById(scope.data.feed.entries[scope.currentIndex].videourl, 0, CONFIG.youtube.SUGGESTED_QUALITY);
                    } else if (player.getPlayerState && player.getPlayerState() !== YT.PlayerState.PLAYING) {
                        player.playVideo();
                    }

				};

				react(playerState, 'togglePlay', function () {
					vidplay();
				});
				react(playerState, 'toggleRewind', function () {
					skip(CONFIG.video.FAST_REWIND);
				});
				react(playerState, 'toggleForward', function () {
					skip(CONFIG.video.FAST_FORWARD);
				});
				//TODO: implement when right pressed and preview of all videos shown to stop video and when the preview is left to play video
				//react(stateLevelService, 'level', function (n) {
				//	if (typeof player === 'undefined' || player === null) {
				//		return;
				//	}
				//	if (n === STATE_CONST.level.PREVIEW_VIEW) {
				//		if (player.getPlayerState() === YT.PlayerState.PLAYING) {
				//			player.pauseVideo();
				//		}
				//	} else if (n === STATE_CONST.level.APP_FEED_VIEW) {
				//		if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
				//			player.playVideo();
				//		}
				//	}
				//});

                //TODO: remove this timeout
                $timeout(function(){
                    if (typeof YT !== 'undefined' && typeof YT.Player !== 'undefined'){
                        loadPlayerAndVideo();
                    }
                })
                

				scope.$watch('currentIndex', function (n, o) {
					if (typeof YT === 'undefined' || typeof YT.Player === 'undefined' || typeof n === 'undefined') {
						return;
					}
					loadPlayerAndVideo();
				});
                // has to come as message from tv frontend
                //react(overlayState, 'overlayOpened', function (n, o) {
					//if (n && typeof(n) !== 'undefined' && player) {
					//	stop();
					//}
					//else if (!n && typeof(n) !== 'undefined' && player) {
					//	if (stateLevelService.level === STATE_CONST.level.APP_FEED_VIEW) {
					//		if (typeof player === 'undefined' || player === null) {
					//			angular.noop();
					//		}
					//		if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
					//			vidplay();
					//		}
					//	}
					//}
                //});
				scope.$on('$destroy', function () {
					player = null;
				});
			}
		};
	};

},{"./detailViewYoutubeTemplate.html":19}],19:[function(require,module,exports){
module.exports = "<div id=\"player\"></div>";

},{}]},{},[1])