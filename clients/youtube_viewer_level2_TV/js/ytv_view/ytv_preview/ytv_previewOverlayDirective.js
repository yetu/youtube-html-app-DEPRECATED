module.exports = function (ytv_playerState, ytv_informationService) {
    'use strict';

    var translateFactor = 700,
        gridWidth = 500;

    var calcTranslate = function (index) {
        var value = translateFactor - (index * gridWidth);
        return value;
    };

    return {
        restrict: 'E',
        template: require('./ytv_previewOverlayTemplate.html'),
        controller: function ($scope) {
            $scope.show = false;
            $scope.selectedIndex = $scope.currentIndex;
            var oldIndex = $scope.currentIndex;
            $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';

            var showView = function(show){
                $scope.show = show;
                ytv_playerState.preview = show;
                $scope.$apply();
            };
            
            if(yetu){
                yetu.onActionBack = function () {
                    if(ytv_playerState.preview){
                        $scope.selectedIndex = oldIndex;
                        $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';
                        showView(false);
                        $scope.$apply();
                    }
                    else{
                        yetu.sendFeedItemIndex(ytv_informationService.playlistItemIndex);
                        yetu.sendQuit();
                    }
                };
                
                yetu.onActionEnter = function() {
                    ytv_informationService.playlistItemIndex = $scope.selectedIndex;
                    showView(false);
                    $scope.$apply();
                }
                    
                yetu.onActionRight = function () {
                    if(ytv_playerState.preview){
                        var nextIndex = $scope.selectedIndex + 1;
                        if (nextIndex >= $scope.data.feed.entries.length) {
                            console.info("no further feed entry... nothing to do");
                            return;
                        } else {
                            $scope.selectedIndex = nextIndex;
                            $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';
                        }
                        $scope.$apply();
                    }
                    else{
                        oldIndex = $scope.selectedIndex;
                        showView(true);
                    }
                };
                
                yetu.onActionLeft = function () {
                    var nextIndex = $scope.selectedIndex - 1;
                    if (nextIndex < 0) {
                        console.info("no further feed entry... nothing to do");
                        return;
                    } else {
                        $scope.selectedIndex = nextIndex;
                        $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';
                    }
                    $scope.$apply();
                };
            }
            

            $scope.$on('$destroy', function () {
                var selectedIndex = $scope.selectedIndex;
                ytv_informationService.playlistItemIndex = selectedIndex;
            });
        }
    };
};
