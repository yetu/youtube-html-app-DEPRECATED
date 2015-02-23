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
