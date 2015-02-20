var youtubeViewerApp = angular.module('youtubeViewerApp',
	[
		'ngRoute',
		'ngResource',
		'pascalprecht.translate',
		'reactTo',
        require('./ytv_detailInformation').name,
        require('./ytv_detailView').name
	]);

youtubeViewerApp.config(function ($provide, $routeProvider, $translateProvider, $httpProvider, $locationProvider) {
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

youtubeViewerApp.run(function(detailInformationService){
    detailInformationService.data = {
        feed: {
            entries: [{
                containsVideo: true,
                imageUrl: "https://i.ytimg.com/vi/vr5n_ZOZ6E8/maxresdefault.jpg",
                title: "Can We Genetically Improve Intelligence?",
                truncatedTitle: "Can We Genetically Improve...",
                videourl: "vr5n_ZOZ6E8"
            },
                {
                    containsVideo: true,
                    imageUrl: "https://i.ytimg.com/vi/vr5n_ZOZ6E8/maxresdefault.jpg",
                    title: "Can We Genetically Improve Intelligence?",
                    truncatedTitle: "Can We Genetically Improve...",
                    videourl: "vr5n_ZOZ6E8"
                }],
            title: "AsapSCIENCE",
            truncatedTitle: "AsapSCIENCE - "
            
        }
        
    }
});

youtubeViewerApp.constant('CONFIG',{
    video: {
        highlightTimeout: 250,
        FAST_FORWARD: 20,
        FAST_REWIND: -20
    }
})

