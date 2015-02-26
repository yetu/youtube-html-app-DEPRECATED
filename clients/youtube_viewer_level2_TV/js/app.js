var youtubeViewerApp = angular.module('youtubeViewerApp',
	[
		'ngRoute',
		'ngResource',
		'pascalprecht.translate',
		'reactTo',
        require('./ytv_information').name,
        require('./ytv_view').name
	]);

youtubeViewerApp.config(function ($routeProvider, $translateProvider, $httpProvider, $locationProvider, i18n) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];

	$locationProvider.html5Mode(false);

	$routeProvider
		.when('/', {
			template: require('./mainTemplate.html')
		})

    //initialize the $translateProvider with all languages including their strings that are in i18n config file
    for(var i=0; i<i18n.languagesAvailable.length; i++){
        var language = i18n.languagesAvailable[i];
        $translateProvider.translations(language, i18n.languages[language]);
    };
    $translateProvider.preferredLanguage('en');
});

youtubeViewerApp.run(function($location,$translate,ytv_paramsService){
    var params = ytv_paramsService.getParams();
    if(params.lang){
        $translate.use(params.lang);
    }
});

youtubeViewerApp.constant('CONFIG',{
    video: {
        highlightTimeout: 250,
        FAST_FORWARD: 20,
        FAST_REWIND: -20
    },
    SUGGESTED_QUALITY: 'highres',
    playlistMaxItemCount: 20,
    pathToLogo: '/assets/appMetaData/assets/logo.svg'
});

youtubeViewerApp.constant('i18n', {
    languagesAvailable: ['en', 'de'],
    languages: {
        en:{
            TOPBAR_SIMILAR: 'Similar',
            TOPBAR_WATCH_LATER: 'Watch later',
            TOPBAR_SHARE: 'Share'
        },
        de:{
            TOPBAR_SIMILAR: 'Ähnliche',
            TOPBAR_WATCH_LATER: 'Später ansehen',
            TOPBAR_SHARE: 'Teilen'
        }
    }
});

