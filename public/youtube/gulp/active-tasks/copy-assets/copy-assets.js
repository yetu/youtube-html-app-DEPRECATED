var gulp = require('gulp'),
	cfg = require('../../common-config').path.scripts,
	clean = require('gulp-clean');

gulp.task('clean-dist', function () {
	return gulp.src('dist', {read: false})
		.pipe(clean());
});

gulp.task('copy-assets', function () {
	gulp.src('fonts/*', {base: './'})
		.pipe(gulp.dest('dist'));
	gulp.src('js/config.js', {base: './'})
		.pipe(gulp.dest('dist'));
	return gulp.src('img/*', {base: './'})
		.pipe(gulp.dest('dist'));
});
