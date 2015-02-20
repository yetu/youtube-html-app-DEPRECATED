module.exports = function ($http, SERVERPATHS, SPECIALPURPOSE) {
	'use strict';
	//TODO: add more payloads
	//TODO: randomize payloads
	var payload = {
		notification: {
			image: 'http://i4.mirror.co.uk/incoming/article141978.ece/alternates/s2197/burglar-trying-to-pry-open-window-on-house-pic-getty-images-123608196.jpg',
			title: 'Outdoor camera',
			subtitle: 'Motion detected',
			backgroundColor: 'rgb(40, 153, 80)'
		}
	};
	this.isSpecialTrigger = function(inputValue){
		var result = [];
		angular.forEach(SPECIALPURPOSE.notificationTriggers, function(value, key) {
			if(inputValue.toLowerCase().indexOf(value) === -1){
				result.push(0);
			} else {
				result.push(1);
			}
		});

		if (result.indexOf(0) !== -1){
			return false;
		} else {
			return true;
		}
	};
	this.sendGeneralNotification = function(){
		return $http.post(SERVERPATHS.notificationUrl, payload);
	};
};
