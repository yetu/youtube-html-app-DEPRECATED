var youtubeApp = angular.module('youtubeApp',
	[
		'ngRoute',
		'ngResource',
		'pascalprecht.translate',
		'reactTo',
		require('./yt_result').name,
		require('./yt_search').name,
		require('./cw_revealLabel').name,
		require('./auth').name
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
    youtubeUrl: "/playlist"
});


//TODO: move to separate directive before commiting !!!!
//replace hardcode strings with params from config
youtubeApp.run(function($window, $http, $interval, $log){

var AUTH_SERVER = "https://auth.yetudev.com";
var SESSION_POLLING_INTERVAL = 3;
var userSettings = {
	userId: ''
};

/*
cookie
af72493d-3870-4c91-9e76-f753673f6fd2

userId
b5829863-edea-4f56-8e14-92089ac27423

*/

	var fetchPersonalData = (function () {
		return $http({method: 'GET', url: '/userId'}).then(function (res) {
			$log.debug('Fetched personal data', res);
			userSettings.userId = res.data;
			console.log("userId: ", userSettings.userId);
		}).catch(function (error) {
			$log.error('Error on perosnal data fetch', error);
			userSettings.userId = "No user data available!";
		})
	})();

 var openidIframe = document.createElement('iframe');
        openidIframe.src = AUTH_SERVER + '/assets/login_status.html';
        openidIframe.id = 'openid-provider';
        openidIframe.style.visibility = 'hidden';
        openidIframe.style.display = 'none';

        document.body.appendChild(openidIframe);

        openidIframe.onload = check_session;

        var timerID = $interval(check_session, SESSION_POLLING_INTERVAL * 1000);


        function check_session() {
            var win = openidIframe.contentWindow;
            win.postMessage('controlcenter ' + userSettings.userId, AUTH_SERVER);
        }


        function receiveMessageP(e) {
//				console.log("blub");
//				console.log(e);
//            e = e.originalEvent;//not cross-browser compatible
            if (e.origin !== AUTH_SERVER) {
                $log.log('domain does not match!');
                return;
            }
            var stat = e.data;

            $log.log('poller | received message:' + stat);

            if (stat == 'invalid') {
                $log.log('session=invalid! Logging out and redirecting');
                $http.get('/logout')
                    .then(logout);
            }
        }

        function logout() {
            clearInterval(timerID);
            $window.location.href = '/';
        }

        angular.element($window).on('message', receiveMessageP);



});
