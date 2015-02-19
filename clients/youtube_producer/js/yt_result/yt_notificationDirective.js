
module.exports = function ($http, SERVERPATHS) {
	return {
		restrict: 'E',
		template: require('./yt_notificationTemplate.html'),
		link: function(scope, element){

			var payload = {
				notification: {
					image: 'http://yetu.nerdgeschoss.de/wp-content/uploads/2014/08/logo@2x.png',
					title: 'The Smart Home Platform',
					subtitle: 'Your applications on every device and operating system.',
					backgroundColor: 'rgb(0, 153, 0)'
				}
			};

			scope.sendNotification = function(e){
				$http.post(SERVERPATHS.notificationUrl, payload).success(function(data){

				}).error(function(data, status){

				})

			};


		}
	}
};
