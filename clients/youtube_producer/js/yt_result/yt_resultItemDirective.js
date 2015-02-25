
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
				var title = angular.element(e.target).attr('data-title')
				var playlistId = angular.element(e.target).attr('data-id');
				ytPlaylistService.sendPlaylistItem(playlistId, title);
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
