module.exports = function ($window, $http, $interval, $log) {
	'use strict';
	return {
		restrict: 'E',
		link: function(scope, element, attr){
			//TODO: use more angular.js methods instead of mix of native and angular stuff

			var openidIframe = document.createElement('iframe');

			openidIframe.src = config.authServer + '/assets/login_status.html';
			openidIframe.id = 'openid-provider';
			openidIframe.style.visibility = 'hidden';
			openidIframe.style.display = 'none';

			document.body.appendChild(openidIframe);

			openidIframe.onload = check_session;

			var timerID = setInterval(check_session, config.sessionPollingInterval * 1000);

			function check_session() {
					var win = openidIframe.contentWindow;
					win.postMessage('youtubeApp ' + config.userUUID, config.authServer);
			}

			
			function receiveMessageP(e) {
					if(e.originalEvent){
						e = e.originalEvent;
					}
					if (e.origin !== config.authServer) {
							$log.log('domain does not match!');
							return;
					}
					var stat = e.data;
					$log.log('poller | received message:' + stat);
					if (stat == 'invalid') {
						$log.log('session=invalid! Logging out and redirecting');
						clearInterval(timerID);
						$window.location.href ='/signOut';
					}
			}

			angular.element($window).on('message', receiveMessageP);
		}
	}
};