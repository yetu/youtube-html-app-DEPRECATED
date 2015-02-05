
module.exports = function (reactTo, $rootScope, ytPlaylistService, $timeout) {
	return {
		restrict: 'E',
		template: require('./yt_resultTemplate.html'),
		controller: function($scope, ytSearchState){
			$scope.resultLists = null;
			$scope.resultListsState = 'initial';
			var react = reactTo($scope, false, true);
			react(ytSearchState,'resultLists', function(newV){
				if(newV){
					$scope.resultLists = newV;
				}
			});
			react(ytSearchState,'resultListsState', function(newV){
				if(newV){
					$scope.resultListsState = newV;
				}
			});
		},
		link: function(scope,element){
			var react = reactTo(scope, false, true);
			scope.sendOverlay = false;
			scope.playListName = '';
			scope.playListSended = null;
			var timeoutId;
			react(ytPlaylistService, 'playlistSendResult', function(newV){
				if(newV){
					scope.playListName = newV.name;
					scope.playListSended = newV.sended;
					scope.sendOverlay = true;
					timeoutId = $timeout(function(){
						scope.sendOverlay = false;
						ytPlaylistService.deletePlaylistSendResult()
					},3000);
				}
			});
			window.onresize=function(){
				$rootScope.$broadcast('RESIZE');
			};

			document.body.onclick = function(){
				if(timeoutId){
					$timeout.cancel(timeoutId);
					scope.sendOverlay = false;
					scope.$apply();
				}
			};
		}
	}
};