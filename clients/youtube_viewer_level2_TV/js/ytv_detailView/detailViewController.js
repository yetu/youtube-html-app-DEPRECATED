/**
 * @class DetailViewController
 */
module.exports = function (detailInformationService, $scope, $rootScope, $timeout, reactTo) {
    'use strict';
    var react = reactTo($scope);

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
    
    $scope.data = detailInformationService.data;
    $scope.currentIndex = detailInformationService.dataFeedEntriesIndex;
    
    console.log($scope.data);

    react(detailInformationService, 'dataFeedEntriesIndex', function (n, o) {
        if (n != o) {
            $scope.currentIndex = n;
        }
    });

};
