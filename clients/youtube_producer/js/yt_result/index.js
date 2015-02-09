module.exports = angular.module('yt_result', ['ngResource', 'pascalprecht.translate', 'reactTo'])
	.directive('ytResult', require('./yt_resultDirective'))
	.service('ytPlaylistService', require('./yt_playlistService'))
	.directive('ytResultItem', require('./yt_resultItemDirective'));

