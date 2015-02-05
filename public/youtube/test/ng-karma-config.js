/*jslint sloppy: true */
module.exports = function (config) {
	config.set({
		basePath: '../',
		frameworks: ['jasmine'],
		browsers: ['Chrome', 'PhantomJS', 'Firefox'],
		autoWatch: true,

		// ng template bundler
		preprocessors: {
			'**/*.html': ['ng-html2js']
		},

		files: [
			{pattern: 'js/vendor/*.js'},
			//include all test helpers from /test folder
			{pattern: 'test/**/!(spec.js)+(.js)'},
			// includes all js files except spec from /js folder
			//{pattern: 'js/**/!(spec.js)+(.js)'},
			// includes all js files except spec from /js folder and watch their changes
			{pattern: 'js/**/!(spec.js)+(.js)', watched: true, served: false, included: false},
			{pattern: 'test/**/*.spec.js'},
			// include templates fo ng-html2js
			{pattern: 'js/**/*.html'}
		],
		exclude: [
			'bower_components/**/test/*.js'
		],

		ngHtml2JsPreprocessor: {
			// setting this option will create only a single module that contains templates
			// from all the files, so you can load them all with module('foo')
			moduleName: 'templates'
		},

		reportSlowerThan: 500
	});
};