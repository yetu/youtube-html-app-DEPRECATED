var youtubeApp = angular.module('youtubeApp',
	[
		'ngRoute',
		'ngResource',
		'pascalprecht.translate',
		'reactTo',
		require('./yt_result').name,
		require('./yt_search').name,
		require('./yt_auth').name,
		require('./yt_notification').name
	]);

youtubeApp.config(function ($provide, $routeProvider, $translateProvider, $httpProvider, $locationProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

	$locationProvider.html5Mode(true);

	$routeProvider
		.when('/', {
			template: require('./mainTemplate.html')
		})
		.otherwise({
			redirectTo: '/'
		});

	$translateProvider.translations('en', {

	});

	$translateProvider.preferredLanguage('en');

});

youtubeApp.constant("SERVERPATHS", {
    youtubeUrl: "/playlist",
		notificationUrl: "/notification"
});

youtubeApp.constant("SPECIALPURPOSE", {
    notificationTriggers: ["yetu", "is", "awesome"],
		successOnSentNotification: "A general notification was sent successfully!",
		errorOnSentNotification: "There was an error sending the general notification",
		displayTimeout: 2000
});
