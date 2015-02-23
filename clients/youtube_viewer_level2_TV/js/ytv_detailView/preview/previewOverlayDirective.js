module.exports = function (informationService) {
    'use strict';

    var translateFactor = 700,
        gridWidth = 500;

    var calcTranslate = function (index) {
        var value = translateFactor - (index * gridWidth);
        return value;
    };

    return {
        restrict: 'E',
        template: require('./previewOverlayTemplate.html'),
        controller: function ($scope) {
            $scope.selectedIndex = $scope.currentIndex;
            var oldIndex = $scope.currentIndex;
            $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';

            //TODO: apply actions on left, back, right
            //var backKeyId = keyboardService.on(keyboardService.keys.BACK, function () {
            //    $scope.selectedIndex = oldIndex;
            //});
            //
            //var rightKeyId = keyboardService.on(keyboardService.keys.RIGHT, function () {
            //    var nextIndex = $scope.selectedIndex + 1;
            //    if (nextIndex >= $scope.data.feed.entries.length) {
            //        console.info("no further feed entry... nothing to do");
            //        return;
            //    } else {
            //        $scope.selectedIndex = nextIndex;
            //        $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';
            //    }
            //});
            //
            //var leftKeyId = keyboardService.on(keyboardService.keys.LEFT, function () {
            //    var nextIndex = $scope.selectedIndex - 1;
            //    if (nextIndex < 0) {
            //        console.info("no further feed entry... nothing to do");
            //        return;
            //    } else {
            //        $scope.selectedIndex = nextIndex;
            //        $scope.translate = 'translateX(' + calcTranslate($scope.selectedIndex) + 'px)';
            //    }
            //});

            $scope.$on('$destroy', function () {
                var selectedIndex = $scope.selectedIndex;
                console.info("selectedIndex: " + selectedIndex);
                informationServices.dataFeedEntriesIndex = selectedIndex;
                //keyboardService.unbind(keyboardService.keys.LEFT, leftKeyId);
                //keyboardService.unbind(keyboardService.keys.RIGHT, rightKeyId);
                //keyboardService.unbind(keyboardService.keys.BACK, backKeyId);
            });
        }
    };
};
