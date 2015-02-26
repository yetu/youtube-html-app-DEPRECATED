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
