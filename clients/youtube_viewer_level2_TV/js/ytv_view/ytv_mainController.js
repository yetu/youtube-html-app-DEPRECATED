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
