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
