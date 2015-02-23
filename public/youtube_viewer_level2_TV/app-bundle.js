(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./js/app');
},{"./js/app":2}],2:[function(require,module,exports){
var youtubeViewerApp = angular.module('youtubeViewerApp',
	[
		'ngRoute',
		'ngResource',
		'pascalprecht.translate',
		'reactTo',
        require('./ytv_information').name,
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

youtubeViewerApp.run(function(){
    //informationService.data = {
    
    //    feed: {
    //        entries: [{
    //            containsVideo: true,
    //            imageUrl: "https://i.ytimg.com/vi/vr5n_ZOZ6E8/maxresdefault.jpg",
    //            title: "Can We Genetically Improve Intelligence?",
    //            truncatedTitle: "Can We Genetically Improve...",
    //            videourl: "vr5n_ZOZ6E8"
    //        },
    //            {
    //                containsVideo: true,
    //                imageUrl: "https://i.ytimg.com/vi/vr5n_ZOZ6E8/maxresdefault.jpg",
    //                title: "Can We Genetically Improve Intelligence?",
    //                truncatedTitle: "Can We Genetically Improve...",
    //                videourl: "vr5n_ZOZ6E8"
    //            }],
    //        title: "AsapSCIENCE",
    //        truncatedTitle: "AsapSCIENCE - ",
    //        logo: "http://apps.yetudev.com:7575/assets/appMetaData/assets/logo.svg"
    //    }
    //
    //}
});

youtubeViewerApp.constant('CONFIG',{
    video: {
        highlightTimeout: 250,
        FAST_FORWARD: 20,
        FAST_REWIND: -20
    },
    playlistMaxItemCount: 20,
    pathToLogo: "/assets/appMetaData/assets/logo.svg"
})


},{"./mainTemplate.html":3,"./ytv_detailView":10,"./ytv_information":19}],3:[function(require,module,exports){
module.exports = "<detail-view></detail-view>\n";

},{}],4:[function(require,module,exports){
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

},{"./controlbarTemplate.html":5}],5:[function(require,module,exports){
module.exports = "<div class=\"controlbar-overlay-container\" style=\"transform: translate(0px, 400px);\" ng-style=\"{'transform': cbIsVisible ? 'translate(0px,0px)':'translate(0px, 400px)'}\">\n  <div class=\"controlbar-container\">\n    <div id=\"btn_rewind\" ng-class=\"{highlight: highlightRewind }\"></div>\n    <div id=\"btn_pause\" ng-show=\"info.isPlaying\"></div>\n    <div id=\"btn_play\" ng-show=\"!info.isPlaying\"></div>\n    <div id=\"btn_forward\" ng-class=\"{highlight: highlightForward }\"></div>\n\n    <div id=\"actTime\">{{info.actTime | controlbarTimeFilter}}</div>\n    <progress id=\"progressbar\" max=\"100\" value=\"{{info.percentage}}\"></progress>\n    <div id=\"duration\">{{ info.duration | controlbarTimeFilter }}</div>\n  </div>\n  <div class=\"controlbar-title\">\n    {{data.feed.entries[currentIndex].title}}\n  </div>\n</div>\n";

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
/**
 * @class DetailViewController
 */
module.exports = function (informationService, $scope, $rootScope, $timeout, reactTo, CONFIG) {
    'use strict';
    var react = reactTo($scope);
    $scope.error = false;

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
    
    //TODO: get this from url
    //var playlistID = "FLLtA9_lHZUPRSJcFKmCxYUA";
    //var itemIndex = 0;
    var playlistId = informationService.getPlaylistId();
    informationService.setFeedItemIndex();

    informationService.loadYTData(playlistId)
        .then(function(feedData){
            $scope.data = {
                feed : feedData,
                logo : CONFIG.pathToLogo
            };
        }, function(response){
            $scope.error = true;
            console.error('Youtube playlist request failed:',response.data.error.message)
        });
    
    react(informationService, 'dataFeedEntriesIndex', function (n, o) {
        if (n != o) {
            $scope.currentIndex = n;
        }
    });

};

},{}],8:[function(require,module,exports){
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

},{"./detailViewTemplate.html":9}],9:[function(require,module,exports){
module.exports = "<div class=\"detail-view-wrapper\"\n     ng-controller=\"DetailViewCtrl\">\n    <div ng-if=\"data\">\n        <div detail-view-youtube\n             class=\"detail-view-content\">\n        </div>\n        <preview-overlay></preview-overlay>\n        <topbar></topbar>\n        <controlbar></controlbar>\n    </div>\n    <div ng-if=\"error\">\n        Error. No youtube data available.\n    </div>\n</div>\n";

},{}],10:[function(require,module,exports){
module.exports = angular.module('ytv_detailView', ['ytv_information', 'pascalprecht.translate'])
    .service('playerState', require('./playerState'))
    .controller('DetailViewCtrl', require('./detailViewController'))
    .directive('detailView', require('./detailViewDirective'))
    .directive('detailViewYoutube', require('./youtube/detailViewYoutube'))
    .directive('previewOverlay', require('./preview/previewOverlayDirective'))
    .directive('topbar', require('./topbar/topbarDirective'))
    .directive('controlbar', require('./controlbar/controlbarDirective'))
    .filter('controlbarTimeFilter', require('./controlbar/controlbarTimeFilter'))
;

},{"./controlbar/controlbarDirective":4,"./controlbar/controlbarTimeFilter":6,"./detailViewController":7,"./detailViewDirective":8,"./playerState":11,"./preview/previewOverlayDirective":12,"./topbar/topbarDirective":14,"./youtube/detailViewYoutube":16}],11:[function(require,module,exports){
module.exports = function () {
	this.togglePlay = false;
	this.toggleForward = false;
	this.toggleRewind = false
};

},{}],12:[function(require,module,exports){
module.exports = function (informationService) {
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
                informationServices.dataFeedEntriesIndex = selectedIndex;
                //keyboardService.unbind(keyboardService.keys.LEFT, leftKeyId);
                //keyboardService.unbind(keyboardService.keys.RIGHT, rightKeyId);
                //keyboardService.unbind(keyboardService.keys.BACK, backKeyId);
            });
        }
    };
};

},{"./previewOverlayTemplate.html":13}],13:[function(require,module,exports){
module.exports = "<div class=\"preview-overlay-container\">\n  <div class=\"preview-overlay-title\">{{data.name}}</div>\n  <div class=\"preview-grid-container\" ng-style=\"{'transform': translate}\">\n    <div ng-repeat=\"item in data.feed.entries\" class=\"preview-grid\"\n         ng-style=\"item.imageUrl && item.imageUrl !== '' && {'background-image':'url('+item.imageUrl+')', 'opacity' : selectedIndex===$index ? '1' : '0.3'}\">\n      <img ng-if=\"!item.imageUrl && data.logo\" class=\"preview-logo\" ng-src=\"{{data.logo}}\" alt=\"logo\">\n\n      <div class=\"preview-grid-content\" ng-if=\"!item.imageUrl\">\n        {{item.title}}\n      </div>\n    </div>\n  </div>\n  <div class=\"active-element\"></div>\n  <div class=\"active-element-title\">{{data.feed.entries[selectedIndex].title}}</div>\n</div>";

},{}],14:[function(require,module,exports){
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

},{"./topbarTemplate.html":15}],15:[function(require,module,exports){
module.exports = "<div class=\"topbar-overlay-container\" style=\"transform: translate(0px, -200px);\" ng-style=\"{'transform': tbIsVisible ? 'translate(0px,0px)':'translate(0px, -200px)'}\">\n  <div class=\"topbar-title-container\">\n    <div class=\"topbar-title-typo-bold\">{{'TOPBAR_SIMILAR' | translate}}</div>\n    <div class=\"topbar-title-typo\">{{'TOPBAR_WATCH_LATER' | translate}}</div>\n    <div class=\"topbar-title-typo\">{{'TOPBAR_SHARE' | translate}}</div>\n    <div class=\"topbar-menu-icon\"></div>\n  </div>\n</div>\n";

},{}],16:[function(require,module,exports){
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

},{"./detailViewYoutubeTemplate.html":17}],17:[function(require,module,exports){
module.exports = "<div id=\"player\"></div>";

},{}],18:[function(require,module,exports){
module.exports = function ($sce, $q) {
    'use strict';

    var truncateTitle = function (entry, feedData) {
        var maxLength = 45;
        feedData.title = feedData.title.replace('(320x240)', '');
        if (feedData.title) {
            maxLength = maxLength - feedData.title.length;
        }
        if (maxLength < 0) {
            maxLength = 45;
            feedData.truncatedTitle = S(feedData.title).truncate(maxLength).s;
            entry.truncatedTitle = '';
        }
        else {
            feedData.truncatedTitle = feedData.title + ' - ';
            if (entry.title.indexOf('- tagesschau') != -1) {
                entry.title = entry.title.substring(0, entry.title.indexOf('- tagesschau'));
            }
            entry.truncatedTitle =
                new S(entry.title).truncate(maxLength).s;
        }

    };

    var isImage = function isImage(entry) {
        var deferred = $q.defer();
        if (entry.imageUrl) {
            var image = new Image();
            image.onerror = function () {
                deferred.resolve(false);
                entry.imageUrl = undefined;
            };
            image.onload = function () {
                deferred.resolve(true);
            };
            image.src = entry.imageUrl;
        }
        else {
            deferred.resolve(false);
        }
        return deferred.promise;
    };

    var truncateTitlesAndCheckImages = function (feedData) {
        var promises = [],
            length = feedData.entries.length;
        for (var i = 0; i < length; i++) {
            promises.push(isImage(feedData.entries[i]));
        }
        return $q.all(promises).then(function () {
            for (var i = 0; i < length; i++) {
                truncateTitle(feedData.entries[i], feedData);
            }
            return feedData;
        });
    };
    /**
     * Parse data object from RSS feed
     * @param  {object} data
     * @return {object} parsed feed object
     */
    var parseYoutubeData = function (data) {
        var items = data.items,
            feedData = {};
        if (items.length > 0) {
            feedData.entries = [];
            if (items[0] && items[0].snippet) {
                feedData.title = items[0].snippet.channelTitle || '';
            }

            var item;
            for (var j = 0, length = items.length; j < length; j++) {
                item = items[j];
                if (item && item.snippet) {
                    var entry = {
                        title: item.snippet.title || '',
                        truncatedTitle: ''
                    };

                    entry.containsVideo = true;
                    if (item.snippet.resourceId) {
                        entry.videourl = item.snippet.resourceId.videoId || '';
                    } else {
                        entry.videourl = '';
                    }
                    if (item.snippet.thumbnails && item.snippet.thumbnails.maxres && item.snippet.thumbnails.maxres.url) {
                        entry.imageUrl = item.snippet.thumbnails.maxres.url;
                    }
                    else if (item.snippet.thumbnails && item.snippet.thumbnails.high && item.snippet.thumbnails.high.url) {
                        entry.imageUrl = item.snippet.thumbnails.high.url;
                    }
                    else if (item.snippet.thumbnails && item.snippet.thumbnails.medium && item.snippet.thumbnails.medium.url) {
                        entry.imageUrl = item.snippet.thumbnails.medium.url;
                    }
                    else if (item.snippet.thumbnails && item.snippet.thumbnails.standard && item.snippet.thumbnails.standard.url) {
                        entry.imageUrl = item.snippet.thumbnails.standard.url;
                    }
                    else if (item.snippet.thumbnails && item.snippet.thumbnails.default && item.snippet.thumbnails.default.url) {
                        entry.imageUrl = item.snippet.thumbnails.default.url;
                    } else {
                        entry.imageUrl = '';
                    }
                    feedData.entries.push(entry);
                }

            }
        }
        var promise = truncateTitlesAndCheckImages(feedData);
        return promise.then(function (feedData) {
            return feedData;
        });
    };

    return {
        parseYoutubeData: parseYoutubeData
    };


}
},{}],19:[function(require,module,exports){
module.exports = angular.module('ytv_information',[])
    .service('informationService', require('./informationService'))
    .service('feedDataGenerator', require('./feedDataGenerator'));

},{"./feedDataGenerator":18,"./informationService":20}],20:[function(require,module,exports){
/**
 * Service to share the data for the opened detailed view between
 * Dashboard and Detail view.
 * @Class DetailService
 */
module.exports = function ($http, feedDataGenerator, CONFIG, $location) {
    'use strict';
    var that = this;
    var defaultIndex = 0;
    this.dataFeedEntriesIndex = defaultIndex; //default index for videos inside a playlist, later overwritten by user selection

    var pluck = function pluck(field) {
        return function (obj) {
            return obj[field];
        }
    };

    this.loadYTData = function (playlistId) {
        return $http({
            method: 'GET',
            url: 'https://www.googleapis.com/youtube/v3/playlistItems',
            params: {
                playlistId: playlistId,
                key: config.youtubeDeveloperToken,
                maxResults: CONFIG.playlistMaxItemCount,
                part: 'snippet'
            }
        }).then(pluck('data'))
            .then(feedDataGenerator.parseYoutubeData)
    };

    this.getPlaylistId = function() {
        var params = $location.search();
        return params.playlistId;
        
    };
    
    this.setFeedItemIndex = function(){
        var params = $location.search();
        if(params.playlistItemIndex){
            that.dataFeedEntriesIndex = params.playlistItemIndex
        }
    };
};

},{}]},{},[1])