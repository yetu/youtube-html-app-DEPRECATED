module.exports = function ($location, $http) {
	'use strict';
	var searchValue;
	this.resultLists = [];
	this.resultListsState = 'initial'; //Enum initial/full/empty

	var that = this;

	this.getSearchValue = function (searchFromUrl) {
		if(!searchValue||searchFromUrl){
			searchValue = $location.search().search;
			if(searchValue){
				searchValue = decodeURI(searchValue);
			}
		}
		return searchValue;
	};

	this.setSearchValue = function(value){
		searchValue = value;
	}


	var getDate = function(timestamp){
		var timespan;
		var date = new Date();
		var createDate = new Date(timestamp);
		var hoursDivide = (1000*60*60);
		var length = (date.getTime()/hoursDivide) - (createDate.getTime()/hoursDivide);
		var hours;
		var days;
		var months;
		var years;
		if(length>24){
			days = parseInt(length/24);
			hours = parseInt(length - (days*24));
			if(days >30){
				months = parseInt(days/30);
				days = days - (months*30);
				if(months >12){
					years = parseInt(months/12);
					months = months - (years*12);
				}
				else{
					years = 0;
				}
			}
			else{
				months = 0;
				years = 0;
			}
		}
		else{
			hours = length;
			days = 0;
			months = 0;
			years = 0;
		}
		var s = "s"
		if(years>0){
			if(years===1){
				s="";
			}
			timespan = years+ ' year'+ s +' ago';
		}
		else if(years===0 && months>0){
			if(months===1){
				s="";
			}
			timespan = months+ ' month'+ s +' ago';
		}
		else if(years===0 && months===0 && days>0){
			if(days===1){
				s="";
			}
			timespan = days+ ' day'+ s +' ago';
		}
		else if(years===0 && months===0 && days===0 && hours>0){
			if(hours===1){
				s="";
			}
			timespan = hours+ ' hour'+ s +' ago';
		}
		return timespan;
	};

	var fillResultList = function(data){
		that.resultLists = [];
		data.items.forEach(function(item){
			var newListItem = {
				playlistId : item.id.playlistId,
				title: item.snippet.title,
				img: item.snippet.thumbnails.medium.url,
				description: {
					createDate: getDate(item.snippet.publishedAt),
					text: item.snippet.description
				}
			};
			$http.get('https://www.googleapis.com/youtube/v3/channels', {
				params: {
					id: item.snippet.channelId,
					key: config.youtubeDeveloperToken,
					part: 'snippet'
				}
			}).success(function(data){
				newListItem.channel = data.items[0].snippet.title;
			});
			that.resultLists.push(newListItem)
		});
		if(that.resultLists.length>0){
			that.resultListsState = 'full';
		}
		else{
			that.resultListsState = 'empty';
		}
	};

	this.setSearchResult = function() {
		$http.get('https://www.googleapis.com/youtube/v3/search', {
			params: {
				maxResults: 10,
				q: searchValue,
				part: 'snippet',
				key: config.youtubeDeveloperToken,
				type: 'playlist'
			}
		}).success(function(data){
			fillResultList(data);
		}).error(function(data){
			console.error("error happening on .setSearchResult:", data);
		});

	};
};