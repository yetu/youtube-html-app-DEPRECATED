var fs = require('fs'),
		p = require('path'),
		gutil = require('gulp-util');


function initTasks(path) {
	var tasks = getAllTasks(path);
	tasks.map(absPath).forEach(require);
	return tasks;
}

function getAllTasks(path) {
	var tasks = [];
	fs.readdirSync(path).forEach(function (file) {
		file = p.join(path, file);
		if (fs.lstatSync(file).isDirectory()) {
			tasks = tasks.concat(getAllTasks(file));
		} else {
			tasks.push(file);
		}
	});
	return tasks;
}

function absPath(file) {
	return p.resolve(file);
}

function replaceStrings(obj, fn){
	Object.keys(obj).forEach(function(key){
		if (typeof obj[key] === 'object'){
			replaceStrings(obj[key], fn);
		} else {
			obj[key] = fn(obj[key]);
		}
	});
}

function initGulp(opts) {
	opts = opts || {};
	var basepath = p.resolve(__dirname, '../', opts.basepath || '');
	function withBasePath(path) {
		return p.resolve(basepath, path);
	}

	var cfg = require('./common-config');
	replaceStrings(cfg, withBasePath);

	var tasks = initTasks('./gulp/active-tasks/');
	gutil.log('gulp-starter # of tasks', gutil.colors.yellow(tasks.length));
	gutil.log('gulp-starter base path:', gutil.colors.yellow(basepath));
	// provide gulp to the gulpfile
	return require('gulp');
}

module.exports = initGulp;