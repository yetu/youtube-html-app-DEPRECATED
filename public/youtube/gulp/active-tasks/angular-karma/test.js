var karma = require('karma').server,
		path = require('path'),
		cfg = require('../../common-config').path.tests,
		gulp = require('gulp');

gulp.task('test', function () {
	var options = {
		configFile: path.join(cfg.configDir, 'ng-karma-config.js'),
		singleRun: true
	};

	options.browsers = ['PhantomJS', 'Chrome', 'Firefox'];
	karma.start(options, console.error.bind(console));
});