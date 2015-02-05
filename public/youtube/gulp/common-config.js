var path = require('path');

var SINGLE_DIST_DIR = 'dist';

// create dist-based path
var dist = function(){
	var args = Array.prototype.slice.call(arguments);
	args.unshift(SINGLE_DIST_DIR);
	return path.join.apply(path, args);
};

// paths for scripts tasks
var scripts = {
	build: {
		src: 'app-bundle.js',
		dest: dist('/')
	},
	dev: {
		src: 'app-bundle.js',
		dest: dist('/')
	}
};

// paths for styles tasks
var styles = {
	build: {
		src: 'styles/app.styl',
		dest: dist('/css')
	},
	dev: {
		src: 'styles/app.styl',
		dest: 'css'
	},
	watch: 'styles/**'
};

module.exports = {
	path: {
		dist : SINGLE_DIST_DIR,
		styles: styles,
		scripts: scripts,
		tests: {
			src: 'test/**.spec.js',
			configDir: 'test'
		}
	}
};