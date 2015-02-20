/**
 * Service to share the data for the opened detailed view between
 * Dashboard and Detail view.
 * @Class DetailService
 */
module.exports = function () {
	'use strict';
	this.data;
	this.dataFeedEntriesIndex = 0; //default index for videos inside a playlist, later overwritten by user selection
	this.isEnhancedFocussedView;
	this.enhancedFocussedViewIsLoading;
	this.enhancedFocussedViewHasError;
};
