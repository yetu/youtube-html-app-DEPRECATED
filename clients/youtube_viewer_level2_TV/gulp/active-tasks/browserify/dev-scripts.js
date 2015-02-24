var gulp = require('gulp'),
	cfg = require('../../common-config').path.scripts,
	browserify = require('browserify'),
	watchify = require('watchify'),
	stringify = require('stringify'),
	gutil = require('gulp-util'),
	source = require('vinyl-source-stream'),
	handleErrors = require('../../util/handleErrors');

gulp.task('tpls', function(){
	app.use(bundle);
});

gulp.task('dev-scripts', function () {
	//var bundler =

	var bundler = watchify()
		.transform(stringify(['.html']))
		.add(cfg.dev.src);

	bundler
			.on('update', rebundle)
			.on('log', gutil.log);

	function rebundle() {
		return bundler.bundle()
				.on('error', handleErrors)
				.pipe(source(cfg.dev.src))
				.pipe(gulp.dest(cfg.dev.dest));
	}

	return rebundle();
});