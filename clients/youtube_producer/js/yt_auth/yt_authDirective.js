module.exports = function ($window, $http, $interval, $log) {
	'use strict';
	return {
		restrict: 'E',
		link: function(scope, element, attr){
			//TODO: use more angular.js methods instead of mix of native and angular stuff
			var userSettings = {
				userId: ''
			};

			var fetchPersonalData = (function () {
				return $http({method: 'GET', url: '/userId'}).then(function (res) {
					$log.debug('Fetched personal data', res);
					userSettings.userId = res.data;
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

			var timerID = setInterval(check_session, SESSION_POLLING_INTERVAL * 1000);

			function check_session() {
					var win = openidIframe.contentWindow;
					win.postMessage('youtubeApp ' + userSettings.userId, AUTH_SERVER);
			}

			
			function receiveMessageP(e) {
					if(e.originalEvent){
						e = e.originalEvent;
					}
					if (e.origin !== AUTH_SERVER) {
							$log.log('domain does not match!');
							return;
					}
					var stat = e.data;
					$log.log('poller | received message:' + stat);
					if (stat == 'invalid') {
							$log.log('session=invalid! Logging out and redirecting');
							$http.get('/signOut')
									.then(logout);
					}
			}

			function logout() {
					clearInterval(timerID);
					$window.location.href = '/';
			}

			angular.element($window).on('message', receiveMessageP);
		}
	}
};