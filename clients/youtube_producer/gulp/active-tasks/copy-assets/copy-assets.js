var gulp = require('gulp'),
	assets = require('../../common-config').path.scripts,
	views = require('../../common-config').path.views,
	clean = require('gulp-clean');

gulp.task('clean-dev-dest', function () {
	return gulp.src(cfg.dev.dest, {read: false})
		.pipe(clean());
});

//TODO: remove paths from this file and put them in structure of common-config.js
gulp.task('copy-assets', function () {
	gulp.src('fonts/*', {base: './'})
		.pipe(gulp.dest(assets.build.dest));
	gulp.src('js/mainTemplate.html', {base: './'})
		.pipe(gulp.dest(assets.build.dest));
	return gulp.src('img/*', {base: './'})
		.pipe(gulp.dest(assets.build.dest));
});

gulp.task('copy-main-html', function(){
	return gulp.src(views.build.src, {base: './'})
		.pipe(gulp.dest(views.build.dest));
});
