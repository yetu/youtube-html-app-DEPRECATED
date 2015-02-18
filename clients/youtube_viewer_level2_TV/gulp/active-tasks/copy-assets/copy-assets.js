var gulp = require('gulp'),
	templates = require('../../common-config').path.templates,
    fonts = require('../../common-config').path.fonts,
    img = require('../../common-config').path.img,
	views = require('../../common-config').path.views,
	clean = require('gulp-clean');

gulp.task('clean-dev-dest', function () {
	return gulp.src(cfg.dev.dest, {read: false})
		.pipe(clean());
});

gulp.task('copy-assets', function () {
	gulp.src(fonts.build.src, {base: './'})
		.pipe(gulp.dest(fonts.build.dest));
	gulp.src(templates.build.src, {base: './'})
		.pipe(gulp.dest(templates.build.dest));
	return gulp.src(img.build.src, {base: './'})
		.pipe(gulp.dest(img.build.dest));
});

gulp.task('copy-ref-templates', function(){
    console.log('copy',views.build.src);
    console.log('to', views.build.dest)
	return gulp.src(views.build.src, {base: './'})
		.pipe(gulp.dest(views.build.dest));
});
