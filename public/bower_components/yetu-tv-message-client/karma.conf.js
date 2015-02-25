// Karma configuration
// Generated on Tue Feb 11 2014 15:42:47 GMT+0100 (CET)

module.exports = function (config) {
	config.set({

		// frameworks to use
		frameworks: ['jasmine'],

		preprocessors: {
			'scripts/*.js': 'coverage'
		},


		coverageReporter: {
			reporters: [
				{
					type: 'html',
					dir: 'coverage/',
					subdir: '.'
				},
				{
					type: 'cobertura',
					subdir: '.'
				}
			]
		},

		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera (has to be installed with `npm install karma-opera-launcher`)
		// - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
		// - PhantomJS
		// - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true,

		reporters: ['dots', 'progress', 'coverage']

	});
};
