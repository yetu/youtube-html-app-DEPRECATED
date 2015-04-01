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
