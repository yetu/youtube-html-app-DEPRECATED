(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./js/app');
},{"./js/app":2}],2:[function(require,module,exports){
var youtubeApp = angular.module('youtubeApp',
	[
		'ngRoute',
		'ngResource',
		'pascalprecht.translate',
		'reactTo',
		require('./yt_result').name,
		require('./yt_search').name,
		require('./yt_auth').name,
		require('./yt_notification').name
	]);

youtubeApp.config(function ($provide, $routeProvider, $translateProvider, $httpProvider, $locationProvider) {
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

youtubeApp.constant("SERVERPATHS", {
    youtubeUrl: "/playlist",
		notificationUrl: "/notification"
});

youtubeApp.constant("SPECIALPURPOSE", {
    notificationTriggers: ["yetu", "is", "awesome"],
		successOnSentNotification: "A general notification was sent successfully!",
		errorOnSentNotification: "There was an error sending the general notification",
		displayTimeout: 2000
});

},{"./mainTemplate.html":3,"./yt_auth":4,"./yt_notification":6,"./yt_result":8,"./yt_search":14}],3:[function(require,module,exports){
module.exports = "<div class=\"container\">\n  <yt-search class=\"yt-search\"></yt-search>\n  <yt-result class=\"yt-result\"></yt-result>\n\t<yt-auth class=\"ng-hide\"></yt-auth>\n</div>";

},{}],4:[function(require,module,exports){
module.exports = angular.module('yt_auth', ['ngResource'])
	.directive('ytAuth', require('./yt_authDirective'));

},{"./yt_authDirective":5}],5:[function(require,module,exports){
module.exports = function ($window, $http, $interval, $log) {
    'use strict';
    return {
        restrict: 'E',
        link: function (scope, element, attr) {
            //TODO: use more angular.js methods instead of mix of native and angular stuff

            var openidIframe = document.createElement('iframe');

            openidIframe.src = config.authServer + '/assets/login_status.html';
            openidIframe.id = 'openid-provider';
            openidIframe.style.visibility = 'hidden';
            openidIframe.style.display = 'none';

            document.body.appendChild(openidIframe);

            openidIframe.onload = check_session;

            var timerID = setInterval(check_session, config.sessionPollingInterval * 1000);

            function check_session() {
                var win = openidIframe.contentWindow;
                win.postMessage('youtubeApp ' + config.userUUID, config.authServer);
            }


            function receiveMessageP(event) {
                if (event.originalEvent) {
                    event = event.originalEvent;
                }
                if (event.origin !== config.authServer) {
                    $log.log('event.origin domain [' + event.origin + '] does not match the configured domain [' + config.authServer + ']');
                    return;
                }
                var stat = event.data;
                $log.log('poller | received message:' + stat);
                if (stat == 'invalid') {
                    $log.log('session=invalid! Logging out and redirecting');
                    clearInterval(timerID);
                    $window.location.href = '/signOut';
                }
            }

            angular.element($window).on('message', receiveMessageP);
        }
    }
};
},{}],6:[function(require,module,exports){
module.exports = angular.module('yt_notification', ['ngResource'])
.service('ytNotification', require('./ytNotification'));
},{"./ytNotification":7}],7:[function(require,module,exports){
module.exports = function ($http, SERVERPATHS, SPECIALPURPOSE) {
	'use strict';
	//TODO: add more payloads
	//TODO: randomize payloads
	var payload = {
		notification: {
			image: 'http://i4.mirror.co.uk/incoming/article141978.ece/alternates/s2197/burglar-trying-to-pry-open-window-on-house-pic-getty-images-123608196.jpg',
			title: 'Outdoor camera',
			subtitle: 'Motion detected',
			backgroundColor: 'rgb(40, 153, 80)'
		}
	};
	this.isSpecialTrigger = function(inputValue){
		var result = [];
		angular.forEach(SPECIALPURPOSE.notificationTriggers, function(value, key) {
			if(inputValue.toLowerCase().indexOf(value) === -1){
				result.push(0);
			} else {
				result.push(1);
			}
		});

		if (result.indexOf(0) !== -1){
			return false;
		} else {
			return true;
		}
	};
	this.sendGeneralNotification = function(){
		return $http.post(SERVERPATHS.notificationUrl, payload);
	};
};

},{}],8:[function(require,module,exports){
module.exports = angular.module('yt_result', ['ngResource', 'pascalprecht.translate', 'reactTo'])
	.directive('ytResult', require('./yt_resultDirective'))
	.service('ytPlaylistService', require('./yt_playlistService'))
	.directive('ytResultItem', require('./yt_resultItemDirective'));


},{"./yt_playlistService":9,"./yt_resultDirective":10,"./yt_resultItemDirective":11}],9:[function(require,module,exports){
module.exports = function ($http, SERVERPATHS) {
	'use strict';
	this.playlistSendResult = null;
	var that = this;
	this.deletePlaylistSendResult = function(){
		that.playlistSendResult = null;
	}
	this.sendPlaylist = function(playlist){
		$http.post(SERVERPATHS.youtubeUrl,playlist).success(function(data){
			that.playlistSendResult = {
				name: decodeURI(playlist.name),
				sended: "YES"
			};
		}).error(function(data, status){
			if(status === 401){
				that.playlistSendResult = {
					name: decodeURI(playlist.name),
					sended: 401
				};
			}else {
				that.playlistSendResult = {
					name: decodeURI(playlist.name),
					sended: "ERROR"
				};
			}

		})
	}
};

},{}],10:[function(require,module,exports){

module.exports = function (reactTo, $rootScope, ytPlaylistService, $timeout) {
	return {
		restrict: 'E',
		template: require('./yt_resultTemplate.html'),
		controller: function($scope, ytSearchState){
			$scope.resultLists = null;
			$scope.resultListsState = 'initial';
			var react = reactTo($scope, false, true);
			react(ytSearchState,'resultLists', function(newV){
				if(newV){
					$scope.resultLists = newV;
				}
			});
			react(ytSearchState,'resultListsState', function(newV){
				if(newV){
					$scope.resultListsState = newV;
				}
			});
		},
		link: function(scope,element){
			var react = reactTo(scope, false, true);
			scope.sendOverlay = false;
			scope.playListName = '';
			scope.playListSended = null;
			var timeoutId;
			react(ytPlaylistService, 'playlistSendResult', function(newV){
				if(newV){
					scope.playListName = newV.name;
					scope.playListSended = newV.sended;
					scope.sendOverlay = true;
					timeoutId = $timeout(function(){
						scope.sendOverlay = false;
						ytPlaylistService.deletePlaylistSendResult()
					},3000);
				}
			});
			window.onresize=function(){
				$rootScope.$broadcast('RESIZE');
			};

			document.body.onclick = function(){
				if(timeoutId){
					$timeout.cancel(timeoutId);
					scope.sendOverlay = false;
					scope.$apply();
				}
			};
		}
	}
};
},{"./yt_resultTemplate.html":13}],11:[function(require,module,exports){

module.exports = function (ytPlaylistService, ytSearchState) {
	var player = null, index = null;
	// 2. This code loads the IFrame Player API code asynchronously.
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	return {
		restrict: 'E',
		template: require('./yt_resultItemTemplate.html'),
		link: function(scope,element){
			scope.playing = false;
			scope.onPlay = function(e){
				index = angular.element(e.target).attr('data-index');
				var playlistId = angular.element(e.target).attr('data-id');
				loadPlayerAndVideo(playlistId);
			}
			scope.onPlaylistSendButtonClick = function(e){
				var title = angular.element(e.target).attr('data-title');
				var playlistId = angular.element(e.target).attr('data-id');
				var playlist = {
					"name": encodeURI(title),
					"source" : playlistId,
					"url" : "https://www.youtube.com/playlist?list="+playlistId
				};
				ytPlaylistService.sendPlaylist(playlist);
			};

			scope.onClose = function(){
				angular.element(element.find('iframe')[0]).remove();
				angular.element(element.find('div')[3]).append('<div id="player'+index+'" class="yt-result-list-item--player">');
				player = null;
				scope.playing=false;

			};

			var loadPlayerAndVideo = function (id){
				window.scrollTo(0,0);
				if (player===null) {
					player = new YT.Player('player'+index, {
						height: '281',
						width: '500',
						playerVars:
						{
							listType:'playlist',
							list: id,
							autoplay: 1,
							controls: 1,
							showinfo: 0
						}
					});
				}
				if (player.loadPlaylist) {
					player.loadPlaylist(id, "playlist", 0, 0, 'highres');
					if (player.getVideoUrl && player.getPlaylist()[0]) {
						player.loadVideoById(player.getPlaylist()[0], 0, 'highres');
					} else if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
						player.playVideo();
					}
				}
				scope.playing=true;

			};



		}
	}
};

},{"./yt_resultItemTemplate.html":12}],12:[function(require,module,exports){
module.exports = "<li class=\"yt-result-list-item\">\n  <div class=\"yt-result-list-item--img\">\n    <img ng-if=\"resultList.img\" class=\"yt-result-list-item--img\" src=\"{{resultList.img}}\"/>\n    <img data-index=\"{{$index}}\" data-id=\"{{resultList.playlistId}}\" class=\"yt-result-list-item--playimg\" src=\"assets/youtube_producer/img/play-icon.svg\" ng-click=\"onPlay($event)\"/>\n  </div>\n  <div class=\"yt-result-list-item--rightContent\">\n    <h1 class=\"yt-result-list-item--title\">\n      <p class=\"yt-result-list-item--title-container\" data-type=\"title\" cw-reveal-label><span>{{resultList.title}}</span></p>\n    </h1>\n    <p class=\"yt-result-list-item--subtitle\">\n      <span>by {{resultList.channel}}</span>\n      <span class=\"point\">*</span>\n      <span>{{resultList.description.createDate}}</span>\n    </p>\n    <p class=\"yt-result-list-item--description\" data-type=\"description\" cw-reveal-label ng-if=\"resultList.description.text\">\n      <span>{{resultList.description.text}}</span>\n    </p>\n    <p class=\"yt-result-list-item--description\" ng-if=\"!resultList.description.text\">No description available.</p>\n  </div>\n  <div class=\"yt-result-list-item--buttons\">\n    <button class=\"yt-result-list-item--button\"\n            ng-click=\"onPlaylistSendButtonClick($event)\"\n            data-title=\"{{resultList.title}}\" data-id=\"{{resultList.playlistId}}\" data-channeltitle=\"{{resultList.channel}}\">\n      Play on TV\n      </button>\n  </div>\n  <div class=\"yt-result-list-item--video\"  ng-class=\"{'visible':playing}\" ng-click=\"onClose()\">\n    <div id=\"{{'player'+$index}}\" class=\"yt-result-list-item--player\">\n    </div>\n    <div ng-click=\"onClose()\" class=\"yt-result-list-item--close\">x</div>\n  </div>\n</li>";

},{}],13:[function(require,module,exports){
module.exports = "<div>\n<div class=\"yt-send-overlay\" ng-class=\"{visible: sendOverlay}\">\n  <p ng-if=\"playListSended==='YES'\">\n    YouTube Playlist \"{{playListName}}\" is now sent to your TV!\n  </p>\n  <p ng-if=\"playListSended==='ERROR'\">\n    YouTube Playlist \"{{playListName}}\" could not be sent to your TV!\n  </p>\n  <p ng-if=\"playListSended===401\">\n    You are not allowed to send the YouTube Playlist \"{{playListName}}\" to TV!\n  </p>\n</div>\n<ul class=\"yt-result-list\">\n  <yt-result-item ng-repeat=\"resultList in resultLists\">‚\n  </yt-result-item>\n  <div ng-if=\"resultListsState==='empty'\">\n    No results found.\n  </div>\n</ul>\n</div>";

},{}],14:[function(require,module,exports){
module.exports = angular.module('yt_search', ['ngResource','pascalprecht.translate'])
	.service('ytSearchState', require('./yt_searchState'))
	.directive('ytSearch', require('./yt_searchDirective'));

},{"./yt_searchDirective":15,"./yt_searchState":16}],15:[function(require,module,exports){
module.exports = function (ytSearchState, ytNotification, SPECIALPURPOSE, $timeout) {
	return {
		restrict: 'E',
		template: require('./yt_searchTemplate.html'),
		link: function(scope, element, attr){
			scope.searchValue = ytSearchState.getSearchValue(true);
			if(scope.searchValue){
				ytSearchState.setSearchResult();
			}
			scope.searchButtonClick = function() {
				scope.initSearch(element.find('input')[0].value);
			};
			scope.searchOnKeyUp = function (event) {
				if (event.keyCode === 13 && event.target.value!="") {
					scope.initSearch(event.target.value);
				}
			};
			scope.initSearch = function(value){
				//if a special search query is entered we send a general notification
				if(ytNotification.isSpecialTrigger(value)){
					var result = ytNotification.sendGeneralNotification();
					result.then(function(result) {
						element.find('input')[0].value = SPECIALPURPOSE.successOnSentNotification;
					}, function(err) {
						element.find('input')[0].value = SPECIALPURPOSE.errorOnSentNotification;
					});
					$timeout(function(){
						element.find('input')[0].value = '';
					}, SPECIALPURPOSE.displayTimeout);
					return;
				//from here on it is normal search
				} else {
					ytSearchState.setSearchValue(value);
					scope.searchValue = ytSearchState.getSearchValue(false);
					ytSearchState.setSearchResult();
				}
			}
		}
	}
};


},{"./yt_searchTemplate.html":17}],16:[function(require,module,exports){
module.exports = function ($location, $http) {
	'use strict';
	var searchValue;
	this.resultLists = [];
	this.resultListsState = 'initial'; //Enum initial/full/empty

	var that = this;

	this.getSearchValue = function (searchFromUrl) {
		if(!searchValue||searchFromUrl){
			searchValue = $location.search().search;
			if(searchValue){
				searchValue = decodeURI(searchValue);
			}
		}
		return searchValue;
	};

	this.setSearchValue = function(value){
		searchValue = value;
	}


	var getDate = function(timestamp){
		var timespan;
		var date = new Date();
		var createDate = new Date(timestamp);
		var hoursDivide = (1000*60*60);
		var length = (date.getTime()/hoursDivide) - (createDate.getTime()/hoursDivide);
		var hours;
		var days;
		var months;
		var years;
		if(length>24){
			days = parseInt(length/24);
			hours = parseInt(length - (days*24));
			if(days >30){
				months = parseInt(days/30);
				days = days - (months*30);
				if(months >12){
					years = parseInt(months/12);
					months = months - (years*12);
				}
				else{
					years = 0;
				}
			}
			else{
				months = 0;
				years = 0;
			}
		}
		else{
			hours = length;
			days = 0;
			months = 0;
			years = 0;
		}
		var s = "s"
		if(years>0){
			if(years===1){
				s="";
			}
			timespan = years+ ' year'+ s +' ago';
		}
		else if(years===0 && months>0){
			if(months===1){
				s="";
			}
			timespan = months+ ' month'+ s +' ago';
		}
		else if(years===0 && months===0 && days>0){
			if(days===1){
				s="";
			}
			timespan = days+ ' day'+ s +' ago';
		}
		else if(years===0 && months===0 && days===0 && hours>0){
			if(hours===1){
				s="";
			}
			timespan = hours+ ' hour'+ s +' ago';
		}
		return timespan;
	};

	var fillResultList = function(data){
		that.resultLists = [];
		data.items.forEach(function(item){
			var newListItem = {
				playlistId : item.id.playlistId,
				title: item.snippet.title,
				img: item.snippet.thumbnails.medium.url,
				description: {
					createDate: getDate(item.snippet.publishedAt),
					text: item.snippet.description
				}
			};
			$http.get('https://www.googleapis.com/youtube/v3/channels', {
				params: {
					id: item.snippet.channelId,
					key: config.youtubeDeveloperToken,
					part: 'snippet'
				}
			}).success(function(data){
				newListItem.channel = data.items[0].snippet.title;
			});
			that.resultLists.push(newListItem)
		});
		if(that.resultLists.length>0){
			that.resultListsState = 'full';
		}
		else{
			that.resultListsState = 'empty';
		}
	};

	this.setSearchResult = function() {
		$http.get('https://www.googleapis.com/youtube/v3/search', {
			params: {
				maxResults: 10,
				q: searchValue,
				part: 'snippet',
				key: config.youtubeDeveloperToken,
				type: 'playlist'
			}
		}).success(function(data){
			fillResultList(data);
		}).error(function(data){
			alert(data)
		});

	};
};
},{}],17:[function(require,module,exports){
module.exports = "<div>\n  <input class=\"yt-search--input\" ng-keyup=\"searchOnKeyUp($event)\" type=\"text\" placeholder=\"Search YouTube Playlist\" value=\"{{searchValue}}\">\n  <button class=\"yt-search--button\" ng-click=\"searchButtonClick()\">\n    <svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t    viewBox=\"0 0 21.7 21.7\" enable-background=\"new 0 0 21.7 21.7\" xml:space=\"preserve\">\n      <path fill=\"#333\" d=\"M21.7,20.3l-6-6c1.2-1.5,1.9-3.4,1.9-5.5c0-4.9-4-8.8-8.8-8.8C4,0,0,4,0,8.8c0,4.9,4,8.8,8.8,8.8\n        c2.1,0,4-0.7,5.5-1.9l6,6L21.7,20.3z M8.8,15.6C5.1,15.6,2,12.6,2,8.8C2,5.1,5.1,2,8.8,2c3.8,0,6.8,3.1,6.8,6.8\n        C15.6,12.6,12.6,15.6,8.8,15.6z\"/>\n    </svg>\n  </button>\n</div>";

},{}]},{},[1])