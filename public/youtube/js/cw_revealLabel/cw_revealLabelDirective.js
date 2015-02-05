
module.exports = function ($timeout) {
	'use strict';
	/**
	 * Shortens a piece of text in a tile
	 * by fading out the last characters.
	 * Complete text will be visible on-focus.
	 */
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {

			var VISIBLE_LINE_COUNT = 2,
				GRADIENT_STEPS = 5, // if changed, updated classes in tile-app-label-reveal.scss
				elementAbove = element.parent()[0],
				lineHeight,
				maxHeight,
				text,
				spans


			// Temporary custom settings for the Discover tile
			if(element.attr('data-type')==='title') {
				VISIBLE_LINE_COUNT = 1;
			}

			/**
			 * Detects if truncating is needed
			 */
			scope.init = function () {

				//reset text to get the right offsetTop of spans (after zooming/resizing)
				element[0].innerHTML = '<span>'+text+'</span>';
				var offsetHeight = element.find('span')[0].offsetHeight;

				//reset bottom space to get the right space after zooming/resizing
				element.css('bottom','20px');

				// wrap each character in a span, and
				element.html('<span>' + element.find('span').text().split('').join('</span><span>') + '</span>');
				spans = element[0].querySelectorAll('span');

				// find out the number of lines and calculate an
				// approximate lineHeight depending on the height of the paragraph
				var numberOfLines = scope.getNumberOfLines();
				lineHeight = parseInt(element.prop('offsetHeight')/numberOfLines);
				maxHeight = VISIBLE_LINE_COUNT * lineHeight;

				if(offsetHeight > maxHeight) {
					// add tile state
					elementAbove.classList.add('with-truncated-label');
					scope.addListeners();
					scope.initEffect();
				}
			};

			scope.getNumberOfLines = function(){
				var numberOfLines = 1;
				var currentOffset = spans[0].offsetTop;
				for (var i = 0, l = spans.length; i < l; i++) {
					if(spans[i].offsetTop != currentOffset) {
						numberOfLines++;
						currentOffset = spans[i].offsetTop;
					}
				}
				return numberOfLines;
			};

			scope.addListeners = function() {

				scope.$on('ON_FOCUS', function() {
						scope.showFullLabel();
				});

				scope.$on('ON_MOUSE_LEAVE', function() {
					scope.showShortenedLabel();
				});
			};

			scope.initEffect = function() {

				// detect the first character that
				// is placed on the first line that exceeds the visible-line-count

				maxHeight += spans[0].offsetTop;

				var index = scope.getFirstSpanOutside();
				if(index<spans.length){
					scope.addTransparency(index);
				}
			};

			/**
			 * Loops through spans and looks for the first span
			 * placed on line (VISIBLE_LINE_COUNT + 1)
			 * @return {Number} Index of that first span
			 */
			scope.getFirstSpanOutside = function() {
				var index;
				for (var i = 0, l = spans.length; i < l; i++) {
					if(spans[i].offsetTop >= maxHeight) {
						index = i;
						break;
					}
				}
				return index;
			};

			/**
			 * Cuts off the text making the last x characters semi-transparent
			 * and wrapping the remaining part in an additional span so we only
			 * need to hide a single span.
			 * @param {Number} index - index of first span placed on line "VISIBLE_LINE_COUNT + 1"
			 */
			scope.addTransparency = function(index) {

				// manipulating node outside of DOM to reduce amount of repaints

				var spansClone = angular.element(spans).clone(),
					spansStringArray = [],
					opacity = 0;

				for (var ii = spansClone.length - 1; ii >= 0; ii--) {

					// add transparency to last characters on line "VISIBLE_LINE_COUNT"
					if(opacity !== 100 && ii < index && angular.element(spansClone[ii]).text() !== ' ' && spansClone.length>index) {

						opacity += (100 / GRADIENT_STEPS);

						if(opacity < 100) {
							spansClone[ii].classList.add(
								'tile-label-semi-transparent',
								'transitionOpacity03',
									'tile-label-semi-transparent-' + opacity
							);
						}
					}

					// store outerHTML in an array for further manipulation
					spansStringArray.push(spansClone[ii].outerHTML);
				}

				// reverse array since for loop walked backwards
				spansStringArray.reverse();
				// wrap part that needs to be invisible (on default state) in separate span
				spansStringArray.splice(index, 0, '<span class="tile-label-hidden-part transitionOpacity03">');
				spansStringArray.splice(spansStringArray.length, 0, '</span>');

				// add manipulated spans to DOM
				element[0].innerHTML = spansStringArray.join('');
			};



			$timeout(function() {
				text = element.find('span').text();
				scope.init();
			});

			scope.$on('RESIZE', function(){
				scope.init();
			});

		}
	};
};

