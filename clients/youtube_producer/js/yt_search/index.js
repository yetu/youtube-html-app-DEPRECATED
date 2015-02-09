module.exports = angular.module('yt_search', ['ngResource','pascalprecht.translate'])
	.service('ytSearchState', require('./yt_searchState'))
	.directive('ytSearch', require('./yt_searchDirective'));
