var gulp = require('gulp'),
	cfg = require('../../common-config').path.scripts,
	browserify = require('browserify'),
	watchify = require('watchify'),
	stringify = require('stringify'),
	rf = require('rimraf')
	gutil = require('gulp-util'),
	source = require('vinyl-source-stream'),
	handleErrors = require('../../util/handleErrors');

gulp.task('tpls', function(){
	app.use(bundle);
});

gulp.task('build-scripts-clear', function (cb) {
	rf(cfg.build.dest, cb)
});

gulp.task('build-scripts', function () {
	var bundler = browserify()
		.transform(stringify(['.html']))
		.add(cfg.build.src);

	bundler
		.on('update', rebundle)
		.on('log', gutil.log);

	function rebundle() {
		return bundler.bundle()
			.on('error', handleErrors)
			.pipe(source(cfg.build.src))
			.pipe(gulp.dest(cfg.build.dest));
	}

	return rebundle();
});