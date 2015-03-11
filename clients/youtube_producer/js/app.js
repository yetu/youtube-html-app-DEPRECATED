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

youtubeApp.config(function ($routeProvider, $translateProvider, $httpProvider, $locationProvider, i18n) {
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

	//initialize the $translateProvider with all languages including their strings that are in i18n config file
    for(var i=0; i<i18n.languagesAvailable.length; i++){
        var language = i18n.languagesAvailable[i];
        $translateProvider.translations(language, i18n.languages[language]);
    };
    $translateProvider.preferredLanguage('en');
});

youtubeApp.run(function($location,$translate){
    var params = $location.search();
    if(params.lang){
        $translate.use(params.lang);
    }
});

youtubeApp.constant("SERVERPATHS", {
    youtubeUrl: "/playlist",
		notificationUrl: "/notification",
		level2Url: "/level2tv",
		imageUrl: "/assets/youtube_producer/img/"
});

youtubeApp.constant("SPECIALPURPOSE", {
    notificationTriggers: ["yetu", "is", "awesome"],
		successOnSentNotification: "A general notification was sent successfully!",
		errorOnSentNotification: "There was an error sending the general notification",
		displayTimeout: 2000
});

youtubeApp.constant("YOUTUBEREQUESTS", {
    maxResults: 1,
    playlistItems: {
        url: 'https://www.googleapis.com/youtube/v3/playlistItems',
        part: 'snippet'
    },
    video: {
        url: 'https://www.googleapis.com/youtube/v3/videos',
        part: 'snippet,contentDetails,statistics'
    }
});
youtubeApp.constant('i18n', {
    languagesAvailable: ['en', 'de'],
    languages: {
        en:{
            COMMIT_BUTTON_LABEL: 'Play'
        },
        de:{
            COMMIT_BUTTON_LABEL: 'Abspielen'
        }
    }
});
