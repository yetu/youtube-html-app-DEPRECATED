module.exports = function($http, SERVERPATHS, SPECIALPURPOSE) {
	'use strict';
	//array object with possible payloads
	var payloads = [{
        headline: 'CamBot',
		notification: {
			subTitle: 'motion detected outside back window',
			image: 'http://i4.mirror.co.uk/incoming/article141978.ece/alternates/s2197/burglar-trying-to-pry-open-window-on-house-pic-getty-images-123608196.jpg'
		}
	}, {
        headline: 'WaterBot',
		notification: {
			subTitle: 'basement water sensor activated',
			image: 'http://www.smbywills.com/core/images/waterproofing/basement-flooding/flooded-basement-home-lg.jpg'
		}
	}, {
        headline: 'DoorBot',
		notification: {
			subTitle: 'doorbell activated',
			image: 'http://static.guim.co.uk/sys-images/Guardian/Pix/pictures/2011/9/4/1315149322196/Man-at-front-door-007.jpg'
		}
	}];
	//checks if the special triggerphrase was entered
	this.isSpecialTrigger = function(inputValue) {
		var result = [];
		angular.forEach(SPECIALPURPOSE.notificationTriggers, function(value, key) {
			if (inputValue.toLowerCase().indexOf(value) === -1) {
				result.push(0);
			} else {
				result.push(1);
			}
		});
		if (result.indexOf(0) !== -1) {
			return false;
		} else {
			return true;
		}
	};
	//returns a random element of the payloads object
	this.sendGeneralNotification = function() {
		return $http.post(SERVERPATHS.notificationUrl, payloads[Math.floor((Math.random() * payloads.length))]);
	};
};
