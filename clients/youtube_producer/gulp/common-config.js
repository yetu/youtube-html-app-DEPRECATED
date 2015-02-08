var path = require('path');

var SINGLE_DIST_DIR = '../../public/youtube_producer';
var VIEWS_DIST_DIR = '../../app/views';

// create dist-based path
var dist = function(dir){
	var args = Array.prototype.slice.call(arguments);
	args.unshift(dir);
	return path.join.apply(path, args);
}

var distAssets = function(){
	return dist(SINGLE_DIST_DIR);
};

var distViews = function(){
	return dist(VIEWS_DIST_DIR);
}

// paths for scripts tasks
var scripts = {
	build: {
		src: 'app-bundle.js',
		dest: distAssets('/')
	},
	dev: {
		src: 'app-bundle.js',
		dest: 'bundle-js'
	}
};

// paths for styles tasks
var styles = {
	build: {
		src: 'styles/app.styl',
		dest: distAssets('/css')
	},
	dev: {
		src: 'styles/app.styl',
		dest: 'css'
	},
	watch: 'styles/**'
};

var views = {
    build: {
        src: 'youtube_producer.scala.html',
        dest: distViews('/')
    }
}

module.exports = {
	path: {
		dist : SINGLE_DIST_DIR,
		styles: styles,
		scripts: scripts,
		views: views,
		tests: {
			src: 'test/**.spec.js',
			configDir: 'test'
		}
	}
};