module.exports = function ($http, $location, $translate, SERVERPATHS, YOUTUBEREQUESTS) {
	'use strict';
	this.playlistSendResult = null;
	var that = this;
	this.deletePlaylistSendResult = function(){
		that.playlistSendResult = null;
	};

	var sendPlaylist = function(playlist){
		var streamTitle = playlist.headline || '';
		$http.post(SERVERPATHS.youtubeUrl,playlist).success(function(data){
			that.playlistSendResult = {
				name: decodeURI(streamTitle),
				sended: "YES"
			};
		}).error(function(data, status){
			if(status === 401){
				that.playlistSendResult = {
					name: decodeURI(streamTitle),
					sended: 401
				};
			}else {
				that.playlistSendResult = {
					name: decodeURI(streamTitle),
					sended: "ERROR"
				};
			}

		});
	};

	// call youtube data api to get playlist item of specified playlist id
	var getYtPlaylistItems = function(playlistId){
		return $http.get(YOUTUBEREQUESTS.playlistItems.url, {
			params: {
				maxResults: YOUTUBEREQUESTS.maxResults,
				part: YOUTUBEREQUESTS.playlistItems.part,
				key: config.youtubeDeveloperToken,
				playlistId: playlistId,

			}
		});
	};

	// call youtube data api to get video item of specified video id
	var getYtVideo = function (videoId){
		return $http.get(YOUTUBEREQUESTS.video.url, {
			params: {
				maxResults: YOUTUBEREQUESTS.maxResults,
				part: YOUTUBEREQUESTS.video.part,
				key: config.youtubeDeveloperToken,
				id: videoId
			}
		});
	};

	var parseYtPlaylistItems = function (playlistItems) {
		var parsedItem = {};
		if (playlistItems.length > 0) {
			var item = playlistItems[0];
			if (item && item.snippet){
				parsedItem.owner = item.snippet.channelTitle || ''; //playlist owner
				parsedItem.title = item.snippet.title || ''; //video title
				if(item.snippet.thumbnails && item.snippet.thumbnails.maxres && item.snippet.thumbnails.maxres.url){
					parsedItem.image = item.snippet.thumbnails.maxres.url;
				}else if(item.snippet.thumbnails && item.snippet.thumbnails.high && item.snippet.thumbnails.high.url) {
					parsedItem.image = item.snippet.thumbnails.high.url;
				}else if(item.snippet.thumbnails && item.snippet.thumbnails.medium && item.snippet.thumbnails.medium.url) {
					parsedItem.image = item.snippet.thumbnails.medium.url;
				}else if(item.snippet.thumbnails && item.snippet.thumbnails.standard && item.snippet.thumbnails.standard.url) {
					parsedItem.image = item.snippet.thumbnails.standard.url;
				}else if(item.snippet.thumbnails && item.snippet.thumbnails.default && item.snippet.thumbnails.default.url){
					parsedItem.image = item.snippet.thumbnails.default.url;
				}else {
					parsedItem.image = '';
				}
				if (item.snippet.resourceId){
					parsedItem.videoId = item.snippet.resourceId.videoId || '';
				} else {
					parsedItem.videoId = '';
				}
			}
		}
		return parsedItem;
	};

	var parseYtVideoData = function (data) {
		var video = {};
		if (data.items && data.items.length > 0 && data.items[0].contentDetails && data.items[0].snippet &&  data.items[0].statistics) {
			video = {
				duration: data.items[0].contentDetails.duration,
				publishDate: data.items[0].snippet.publishedAt,
				definition: data.items[0].contentDetails.definition,
				viewCount: data.items[0].statistics.viewCount
			};
		}
		return video;
	};

	this.sendPlaylistItem = function(playlistId, playlistTitle, urlToApp){
		var playlistItem, videoItem;

		getYtPlaylistItems(playlistId).success(function(ptData){
			playlistItem = parseYtPlaylistItems(ptData.items);
			getYtVideo(playlistItem.videoId).success(function(vData){
				videoItem = parseYtVideoData(vData);

				$translate(['COMMIT_BUTTON_LABEL']).then(function (translations) {
					var url =  $location.protocol() + '://' + $location.host() + ":" + $location.port();
					var playlist = {
						action:{
							url: url + SERVERPATHS.level2Url,
							type: 'open',
							parameter:{
								playlistId: playlistId,
								itemIndex: 0
							},
							button:{
								icon: url + SERVERPATHS.imageUrl + "notification_play.svg",
								label: translations.COMMIT_BUTTON_LABEL
							}
						},
						headline: encodeURI(playlistTitle),
						stream: {
							owner:playlistItem.owner,
							title: encodeURI(playlistItem.title),
							image: playlistItem.image,
							duration: videoItem.duration,
							publishDate: videoItem.publishDate,
							viewCount: videoItem.viewCount,
							resolution: videoItem.resolution
						}
					};
					sendPlaylist(playlist);
				});

			}).error(function(data){
                console.error("error happening on getYtVideo: ", data);
			});
		}).error(function(data){
            console.error("error happening on getYtPlaylistItems: ", data);
		});
	};
};

