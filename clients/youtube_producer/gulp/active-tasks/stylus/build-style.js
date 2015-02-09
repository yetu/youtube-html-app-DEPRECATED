var stylus = require('gulp-stylus'),
	prefix = require('gulp-autoprefixer'),
	gulp = require('gulp'),
	nib = require('nib'),
	cache = require('gulp-cached'),
	styles = require('./../../common-config').path.styles.build,
	handleErrors = require('../../util/handleErrors');

gulp.task('build-style-clean', function (cb) {
	rf(styles.dest, cb);
});

gulp.task('build-style', function () {
	return gulp.src(styles.src)
		//		.pipe(cache('styles'))
		.pipe(stylus({use : [nib()]}))
		.on('error', handleErrors)
		.pipe(prefix())
		.on('error', handleErrors)
		.pipe(gulp.dest(styles.dest))
});