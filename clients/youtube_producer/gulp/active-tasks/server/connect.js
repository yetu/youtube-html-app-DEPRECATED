var gulp = require('gulp');
var connect = require('gulp-connect'),
	cfg = require('../../common-config').servers,
	path = require('path');

gulp.task('connect', function () {
	connect.server({
		root: [path.resolve('.')],
		port: 9999,
		livereload: true,
		middleware: function (connect, o) {
			return [ (function () {
				var url = require('url');
				var proxy = require('proxy-middleware');
				var options = url.parse((cfg.dev.url + cfg.dev.context));
				options.route = cfg.dev.context;
				return proxy(options);
			})(),(function () {
				var url = require('url');
				var proxy = require('proxy-middleware');
				var options = url.parse((cfg.dev.url + '/auth'));
				options.route = '/auth';
				return proxy(options);
			})() ];
		}
	})
});
