var gulp = require('gulp'),
	cache = require('gulp-cached'),
	path = require('../../common-config').path;

gulp.task('watcher', function () {
	gulp.watch(path.styles.watch, ['dev-style']);
});