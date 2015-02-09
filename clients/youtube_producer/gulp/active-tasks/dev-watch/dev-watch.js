var gulp = require('gulp'),
	cache = require('gulp-cached'),
	path = require('../../common-config').path;

gulp.task('dev-watch', function () {
	gulp.watch(path.styles.watch, ['build-style']);
    gulp.watch(path.scripts.watch, ['build-scripts']);
    gulp.watch(path.img.watch, ['copy-assets']);
    gulp.watch(path.templates.watch, ['copy-assets']);
    gulp.watch(path.views.watch, ['copy-ref-templates']);
});