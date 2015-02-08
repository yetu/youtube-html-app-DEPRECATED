module.exports = function (ytSearchState) {
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
				if (event.keyCode === 13 && event.target.value!="") {
					scope.initSearch(event.target.value);
				}
			};
			scope.initSearch = function(value){
				ytSearchState.setSearchValue(value);
				scope.searchValue = ytSearchState.getSearchValue(false);
				ytSearchState.setSearchResult()
			}
		}
	}
};

