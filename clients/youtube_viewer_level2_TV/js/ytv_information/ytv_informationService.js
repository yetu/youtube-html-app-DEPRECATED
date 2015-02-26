/**
 * Service to share the data for the opened detailed view between
 * Dashboard and Detail view.
 * @Class DetailService
 */
module.exports = function ($http, ytv_dataGenerator, CONFIG, $location) {
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
        var params = that.getParams();
        return params.playlistId;
    };
    
    this.getParams = function(){
        return location.search.split('\?').join('').split('\&').reduce(function(acc, pair){
                                         var res= pair.split('=')
                                         acc[res[0]] = res[1]
                                         return acc
                                         }, {})}
    
    this.setPlaylistItemIndex = function(){
        var params = that.getParams();
        if(params.itemIndex){
            that.playlistItemIndex = parseInt(params.itemIndex)
        }
    };
};
