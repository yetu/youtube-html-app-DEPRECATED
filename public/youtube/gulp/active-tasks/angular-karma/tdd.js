var karma = require('karma').server,
		path = require('path'),
		cfg = require('../../common-config').path.tests,
		gulp = require('gulp');

gulp.task('tdd', function () {
	var options = {
		configFile: path.join(cfg.configDir, 'ng-karma-config.js'),
		singleRun: false
	};

	options.browsers = ['PhantomJS', 'Chrome'];
	karma.start(options, console.error.bind(console));
});