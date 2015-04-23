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
        require('./ytv_view').name
	]);

youtubeViewerApp.config(function ($routeProvider, $translateProvider, $httpProvider, $locationProvider, i18n) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

	$locationProvider.html5Mode(false);

	$routeProvider
		.when('/', {
			template: require('./mainTemplate.html')
		})

    //initialize the $translateProvider with all languages including their strings that are in i18n config file
    for(var i=0; i<i18n.languagesAvailable.length; i++){
        var language = i18n.languagesAvailable[i];
        $translateProvider.translations(language, i18n.languages[language]);
    };
    $translateProvider.preferredLanguage('en');
});

youtubeViewerApp.run(function($location,$translate,ytv_paramsService){
    var params = ytv_paramsService.getParams();
    if(params.lang){
        $translate.use(params.lang);
    }
});

youtubeViewerApp.constant('CONFIG',{
    video: {
        highlightTimeout: 250,
        FAST_FORWARD: 20,
        FAST_REWIND: -20
    },
    SUGGESTED_QUALITY: 'highres',
    playlistMaxItemCount: 20,
    pathToLogo: '/assets/appMetaData/assets/logo.svg'
});

youtubeViewerApp.constant('i18n', {
    languagesAvailable: ['en', 'de'],
    languages: {
        en:{
            TOPBAR_SIMILAR: 'Similar',
            TOPBAR_WATCH_LATER: 'Watch later',
            TOPBAR_SHARE: 'Share'
        },
        de:{
            TOPBAR_SIMILAR: 'Ähnliche',
            TOPBAR_WATCH_LATER: 'Später ansehen',
            TOPBAR_SHARE: 'Teilen'
        }
    }
});


},{"./mainTemplate.html":3,"./ytv_information":4,"./ytv_view":8}],3:[function(require,module,exports){
module.exports = "<div class=\"detail-view-wrapper\"\n     ng-controller=\"ytv_MainController\">\n    <div ng-if=\"data\">\n        <div ytv-player\n             class=\"detail-view-content\">\n        </div>\n        <ytv-preview-overlay></ytv-preview-overlay>\n        <ytv-topbar></ytv-topbar>\n        <ytv-controlbar></ytv-controlbar>\n    </div>\n    <div ng-if=\"error\">\n        Error. No youtube data available.\n    </div>\n</div>";

},{}],4:[function(require,module,exports){
module.exports = angular.module('ytv_information',[])
    .service('ytv_informationService', require('./ytv_informationService'))
    .service('ytv_paramsService', require('./ytv_paramsService'))
    .service('ytv_dataGenerator', require('./ytv_dataGenerator'));

},{"./ytv_dataGenerator":5,"./ytv_informationService":6,"./ytv_paramsService":7}],5:[function(require,module,exports){
module.exports = function ($q) {
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
},{}],6:[function(require,module,exports){
/**
 * Service to load playlist data
 * @Class informationService
 */
module.exports = function ($http, ytv_dataGenerator, CONFIG, ytv_paramsService) {
    'use strict';
    var that = this;
    var defaultIndex = 0;
    this.playlistItemIndex = defaultIndex; //default index for videos inside a playlist, later overwritten by user selection

    var pluck = function pluck(field) {
        return function (obj) {
            return obj[field];
        }
    };

    this.loadPlaylistData = function (playlistId) {
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
            .then(ytv_dataGenerator.parseYoutubeData)
    };

    this.getPlaylistId = function() {
        var params =  ytv_paramsService.getParams();
        return params.playlistId;
    };
    
    this.setPlaylistItemIndex = function(){
        var params = ytv_paramsService.getParams();
        if(params.itemIndex){
            that.playlistItemIndex = parseInt(params.itemIndex)
        }
    };
};

},{}],7:[function(require,module,exports){
module.exports = function () {
    'use strict';
    this.getParams = function(){
        return location.search.split('\?').join('').split('\&').reduce(function(acc, pair){
            var res= pair.split('=');
            acc[res[0]] = res[1];
            return acc
        }, {})}

};

},{}],8:[function(require,module,exports){
module.exports = angular.module('ytv_view', ['ytv_information', 'pascalprecht.translate'])
    .service('ytv_playerState', require('./ytv_playerState'))
    .controller('ytv_MainController', require('./ytv_mainController'))
    .directive('ytvPlayer', require('./ytv_player/ytv_playerDirective'))
    .directive('ytvPreviewOverlay', require('./ytv_preview/ytv_previewOverlayDirective'))
    .directive('ytvTopbar', require('./ytv_topbar/ytv_topbarDirective'))
    .directive('ytvControlbar', require('./ytv_controlbar/ytv_controlbarDirective'))
    .filter('ytv_ControlbarTimeFilter', require('./ytv_controlbar/ytv_controlbarTimeFilter'))
;

},{"./ytv_controlbar/ytv_controlbarDirective":9,"./ytv_controlbar/ytv_controlbarTimeFilter":11,"./ytv_mainController":12,"./ytv_player/ytv_playerDirective":13,"./ytv_playerState":15,"./ytv_preview/ytv_previewOverlayDirective":16,"./ytv_topbar/ytv_topbarDirective":18}],9:[function(require,module,exports){
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
},{"./ytv_controlbarTemplate.html":10}],10:[function(require,module,exports){
module.exports = "<div class=\"controlbar-overlay-container\" style=\"transform: translate(0px, 400px);\" ng-style=\"{'transform': cbIsVisible ? 'translate(0px,0px)':'translate(0px, 400px)'}\">\n  <div class=\"controlbar-container\">\n    <div id=\"btn_rewind\" ng-class=\"{highlight: highlightRewind }\"></div>\n    <div id=\"btn_pause\" ng-show=\"info.isPlaying\"></div>\n    <div id=\"btn_play\" ng-show=\"!info.isPlaying\"></div>\n    <div id=\"btn_forward\" ng-class=\"{highlight: highlightForward }\"></div>\n\n    <div id=\"actTime\">{{info.actTime | ytv_ControlbarTimeFilter}}</div>\n    <progress id=\"progressbar\" max=\"100\" value=\"{{info.percentage}}\"></progress>\n    <div id=\"duration\">{{ info.duration | ytv_ControlbarTimeFilter }}</div>\n  </div>\n  <div class=\"controlbar-title\">\n    {{data.feed.entries[currentIndex].title}}\n  </div>\n</div>\n";

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
/**
 * @class ytv_mainController
 */
module.exports = function (ytv_informationService, $scope, reactTo, CONFIG) {
    'use strict';
    var react = reactTo($scope);
    $scope.error = false;
    $scope.info = {
        duration: 0,
        actTime: 0,
        percentage: 0,
        isPlaying: true
    };

    var playlistId = ytv_informationService.getPlaylistId();
    ytv_informationService.setPlaylistItemIndex();
    $scope.currentIndex = ytv_informationService.playlistItemIndex;
    ytv_informationService.loadPlaylistData(playlistId)
        .then(function(playlistData){
            $scope.data = {
                feed : playlistData,
                logo : CONFIG.pathToLogo
            };
        }, function(response){
            $scope.error = true;
            console.error('Youtube playlist request failed:',response.data.error.message);
        });

    react(ytv_informationService, 'playlistItemIndex', function (n, o) {
        if (n !== o) {
            $scope.currentIndex = n;
        }
    });

};

},{}],13:[function(require,module,exports){
module.exports = function($interval, CONFIG, reactTo, ytv_playerState) {
	'use strict';
	return {
		restrict: 'A',
		template: require('./ytv_playerTemplate.html'),
		link: function(scope, element, attrs) {
			var react = reactTo(scope);
			var player;
			// 2. This code loads the IFrame Player API code asynchronously.
			var tag = document.createElement('script');

			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			var timeupdater;
			var updateTime = function() {
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

			var forceResolution = function(event){
				var actualPlaybackQuality = event.target.getPlaybackQuality();
				var idealQuality = 'hd720';

				if (actualPlaybackQuality !== idealQuality) {
					event.target.setPlaybackQuality(idealQuality);
				}
			};

			var onReady = function(event){
				forceResolution(event);
			};

			var onStateChange = function(event) {
				forceResolution(event);
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

			var stop = function() {
				if (typeof player === 'undefined' || player === null) {
					return;
				}
				player.pauseVideo();
			};

			var vidplay = function() {
				if (typeof player === 'undefined' || player === null) {
					return;
				}
				if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
					player.playVideo();
				} else {
					player.pauseVideo();
				}
			};

			var skip = function(value) {
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

			var loadPlayerAndVideo = function() {
				if (typeof player === 'undefined' || player === null) {
					player = new YT.Player('player', {
						height: '1080',
						width: '1920',
						playerVars: {
							'autoplay': 1,
							'controls': 0,
							'showinfo': 0
						},
						videoId: scope.data.feed.entries[scope.currentIndex].videourl,
						events: {
							'onStateChange': onStateChange,
							'onReady': onReady
						}
					});
				}
				if (player.getVideoUrl && player.getVideoUrl().indexOf(scope.data.feed.entries[scope.currentIndex].videourl) === -1) {
					player.loadVideoById(scope.data.feed.entries[scope.currentIndex].videourl, 0, CONFIG.SUGGESTED_QUALITY);
				} else if (player.getPlayerState && player.getPlayerState() !== YT.PlayerState.PLAYING) {
					player.playVideo();
				}

			};

			if (yetu) {
				yetu.onActionPlay = function() {
					vidplay();
				};
				yetu.onActionRewind = function() {
					skip(CONFIG.video.FAST_REWIND);
					ytv_playerState.toggleRewind = !ytv_playerState.toggleRewind;
				};
				yetu.onActionForward = function() {
					skip(CONFIG.video.FAST_FORWARD);
					ytv_playerState.toggleForward = !ytv_playerState.toggleForward;
				};
				yetu.onReceiveMessage = function(data) {
					if (data.message === 'notification arrived') {
						if (player.getPlayerState() === YT.PlayerState.PLAYING) {
							player.pauseVideo();
						}
					} else if (data.message === 'notification closed') {
						if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
							player.playVideo();
						}
					}
				};
			}
			react(ytv_playerState, 'preview', function(n) {
				if (typeof player === 'undefined' || player === null) {
					return;
				}
				if (n) {
					if (player.getPlayerState() === YT.PlayerState.PLAYING) {
						player.pauseVideo();
					}
				} else {
					if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
						player.playVideo();
					}
				}
			});
			if (typeof YT !== 'undefined' && typeof YT.Player !== 'undefined') {
				loadPlayerAndVideo();
			}

			scope.$watch('currentIndex', function(n, o) {
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
			scope.$on('$destroy', function() {
				player = null;
			});
		}
	};
};

},{"./ytv_playerTemplate.html":14}],14:[function(require,module,exports){
module.exports = "<div id=\"player\"></div>";

},{}],15:[function(require,module,exports){
module.exports = function () {
	this.preview = false;
    this.toggleRewind = true;
    this.toggleForward = true;
};

},{}],16:[function(require,module,exports){
module.exports = function (ytv_playerState, ytv_informationService) {
    'use strict';

    var translateFactor = 700,
        gridWidth = 500;

    var calcTranslate = function (index) {
        var value = translateFactor - (index * gridWidth);
        return value;
    };

    return {
        restrict: 'E',
        template: require('./ytv_previewOverlayTemplate.html'),
        controller: function ($scope) {
            $scope.show = false;
            $scope.selectedIndex = $scope.currentIndex;
            var oldIndex = $scope.currentIndex;
            $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';

            var showView = function(show){
                $scope.show = show;
                ytv_playerState.preview = show;
                $scope.$apply();
            };
            
            if(yetu){
                yetu.onActionBack = function () {
                    if(ytv_playerState.preview){
                        $scope.selectedIndex = oldIndex;
                        $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';
                        showView(false);
                        $scope.$apply();
                    }
                    else{
                        yetu.sendFeedItemIndex(ytv_informationService.playlistItemIndex);
                        yetu.sendQuit();
                    }
                };
                
                yetu.onActionEnter = function() {
                    ytv_informationService.playlistItemIndex = $scope.selectedIndex;
                    showView(false);
                    $scope.$apply();
                }
                    
                yetu.onActionRight = function () {
                    if(ytv_playerState.preview){
                        var nextIndex = $scope.selectedIndex + 1;
                        if (nextIndex >= $scope.data.feed.entries.length) {
                            console.info("no further feed entry... nothing to do");
                            return;
                        } else {
                            $scope.selectedIndex = nextIndex;
                            $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';
                        }
                        $scope.$apply();
                    }
                    else{
                        oldIndex = $scope.selectedIndex;
                        showView(true);
                    }
                };
                
                yetu.onActionLeft = function () {
                    var nextIndex = $scope.selectedIndex - 1;
                    if (nextIndex < 0) {
                        console.info("no further feed entry... nothing to do");
                        return;
                    } else {
                        $scope.selectedIndex = nextIndex;
                        $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';
                    }
                    $scope.$apply();
                };
            }
            

            $scope.$on('$destroy', function () {
                var selectedIndex = $scope.selectedIndex;
                ytv_informationService.playlistItemIndex = selectedIndex;
            });
        }
    };
};

},{"./ytv_previewOverlayTemplate.html":17}],17:[function(require,module,exports){
module.exports = "<div class=\"preview-overlay-container\" ng-if=\"show\">\n  <div class=\"preview-overlay-title\">{{data.name}}</div>\n  <div class=\"preview-grid-container\" ng-style=\"{'transform': translate}\">\n    <div ng-repeat=\"item in data.feed.entries\" class=\"preview-grid\"\n         ng-style=\"item.imageUrl && item.imageUrl !== '' && {'background-image':'url('+item.imageUrl+')', 'opacity' : selectedIndex===$index ? '1' : '0.3'}\">\n      <img ng-if=\"!item.imageUrl && data.logo\" class=\"preview-logo\" ng-src=\"{{data.logo}}\" alt=\"logo\">\n\n      <div class=\"preview-grid-content\" ng-if=\"!item.imageUrl\">\n        {{item.title}}\n      </div>\n    </div>\n  </div>\n  <div class=\"active-element\"></div>\n  <div class=\"active-element-title\">{{data.feed.entries[selectedIndex].title}}</div>\n</div>";

},{}],18:[function(require,module,exports){
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

},{"./ytv_topbarTemplate.html":19}],19:[function(require,module,exports){
module.exports = "<div class=\"topbar-overlay-container\" style=\"transform: translate(0px, -200px);\" ng-style=\"{'transform': tbIsVisible ? 'translate(0px,0px)':'translate(0px, -200px)'}\">\n  <div class=\"topbar-title-container\">\n    <div class=\"topbar-title-typo-bold\">{{'TOPBAR_SIMILAR' | translate}}</div>\n    <div class=\"topbar-title-typo\">{{'TOPBAR_WATCH_LATER' | translate}}</div>\n    <div class=\"topbar-title-typo\">{{'TOPBAR_SHARE' | translate}}</div>\n    <div class=\"topbar-menu-icon\"></div>\n  </div>\n</div>\n";

},{}]},{},[1])