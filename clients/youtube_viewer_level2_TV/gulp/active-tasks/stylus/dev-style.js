var stylus = require('gulp-stylus'),
		prefix = require('gulp-autoprefixer'),
		gulp = require('gulp'),
	  nib = require('nib'),
		cache = require('gulp-cached'),
		styles = require('./../../common-config').path.styles.dev,
		handleErrors = require('../../util/handleErrors');

gulp.task('dev-style', function () {
	gulp.src(styles.src)
	//		.pipe(cache('styles'))
			.pipe(stylus({use : [nib()]}))
			.on('error', handleErrors)
			.pipe(prefix())
			.on('error', handleErrors)
			.pipe(gulp.dest(styles.dest))
});