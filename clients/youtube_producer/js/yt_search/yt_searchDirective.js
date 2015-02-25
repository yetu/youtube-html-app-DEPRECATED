module.exports = function (ytSearchState, ytNotification, SPECIALPURPOSE, $timeout) {
	return {
		restrict: 'E',
		template: require('./yt_searchTemplate.html'),
		link: function(scope, element, attr){
			scope.searchValue = ytSearchState.getSearchValue(true);
			if(scope.searchValue){
				ytSearchState.setSearchResult();
			}
			scope.searchButtonClick = function() {
				scope.initSearch(element.find('input')[0].value);
			};
			scope.searchOnKeyUp = function (event) {
				if (event.keyCode === 13 && event.target.value !== "") {
					scope.initSearch(event.target.value);
				}
			};
			scope.initSearch = function(value){
				//if a special search query is entered we send a general notification
				if(ytNotification.isSpecialTrigger(value)){
					var result = ytNotification.sendGeneralNotification();
					result.then(function() {
						element.find('input')[0].value = SPECIALPURPOSE.successOnSentNotification;
					}, function() {
						element.find('input')[0].value = SPECIALPURPOSE.errorOnSentNotification;
					});
					$timeout(function(){
						element.find('input')[0].value = '';
					}, SPECIALPURPOSE.displayTimeout);
					return;
				//from here on it is normal search
				} else {
					ytSearchState.setSearchValue(value);
					scope.searchValue = ytSearchState.getSearchValue(false);
					ytSearchState.setSearchResult();
				}
			};
		}
	};
};

