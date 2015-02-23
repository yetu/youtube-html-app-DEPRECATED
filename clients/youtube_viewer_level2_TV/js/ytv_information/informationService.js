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
        if(params.feedItemIndex){
            that.dataFeedEntriesIndex = params.feedItemIndex
        }
    };
};
