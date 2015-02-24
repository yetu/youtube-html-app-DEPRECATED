module.exports = function ($q) {
    'use strict';

    var truncateTitle = function (entry, feedData) {
        var maxLength = 45;
        feedData.title = feedData.title.replace('(320x240)', '');
        if (feedData.title) {
            maxLength = maxLength - feedData.title.length;
        }
        if (maxLength < 0) {
            maxLength = 45;
            feedData.truncatedTitle = S(feedData.title).truncate(maxLength).s;
            entry.truncatedTitle = '';
        }
        else {
            feedData.truncatedTitle = feedData.title + ' - ';
            entry.truncatedTitle =
                new S(entry.title).truncate(maxLength).s;
        }

    };

    var isImage = function isImage(entry) {
        var deferred = $q.defer();
        if (entry.imageUrl) {
            var image = new Image();
            image.onerror = function () {
                deferred.resolve(false);
                entry.imageUrl = undefined;
            };
            image.onload = function () {
                deferred.resolve(true);
            };
            image.src = entry.imageUrl;
        }
        else {
            deferred.resolve(false);
        }
        return deferred.promise;
    };

    var truncateTitlesAndCheckImages = function (feedData) {
        var promises = [],
            length = feedData.entries.length;
        for (var i = 0; i < length; i++) {
            promises.push(isImage(feedData.entries[i]));
        }
        return $q.all(promises).then(function () {
            for (var i = 0; i < length; i++) {
                truncateTitle(feedData.entries[i], feedData);
            }
            return feedData;
        });
    };
    /**
     * Parse data object from RSS feed
     * @param  {object} data
     * @return {object} parsed feed object
     */
    var parseYoutubeData = function (data) {
        var items = data.items,
            feedData = {};
        if (items.length > 0) {
            feedData.entries = [];
            if (items[0] && items[0].snippet) {
                feedData.title = items[0].snippet.channelTitle || '';
            }

            var item;
            for (var j = 0, length = items.length; j < length; j++) {
                item = items[j];
                if (item && item.snippet) {
                    var entry = {
                        title: item.snippet.title || '',
                        truncatedTitle: ''
                    };

                    entry.containsVideo = true;
                    if (item.snippet.resourceId) {
                        entry.videourl = item.snippet.resourceId.videoId || '';
                    } else {
                        entry.videourl = '';
                    }
                    if (item.snippet.thumbnails && item.snippet.thumbnails.maxres && item.snippet.thumbnails.maxres.url) {
                        entry.imageUrl = item.snippet.thumbnails.maxres.url;
                    }
                    else if (item.snippet.thumbnails && item.snippet.thumbnails.high && item.snippet.thumbnails.high.url) {
                        entry.imageUrl = item.snippet.thumbnails.high.url;
                    }
                    else if (item.snippet.thumbnails && item.snippet.thumbnails.medium && item.snippet.thumbnails.medium.url) {
                        entry.imageUrl = item.snippet.thumbnails.medium.url;
                    }
                    else if (item.snippet.thumbnails && item.snippet.thumbnails.standard && item.snippet.thumbnails.standard.url) {
                        entry.imageUrl = item.snippet.thumbnails.standard.url;
                    }
                    else if (item.snippet.thumbnails && item.snippet.thumbnails.default && item.snippet.thumbnails.default.url) {
                        entry.imageUrl = item.snippet.thumbnails.default.url;
                    } else {
                        entry.imageUrl = '';
                    }
                    feedData.entries.push(entry);
                }

            }
        }
        var promise = truncateTitlesAndCheckImages(feedData);
        return promise.then(function (feedData) {
            return feedData;
        });
    };

    return {
        parseYoutubeData: parseYoutubeData
    };


}