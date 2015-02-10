/**
 *  To add a new task, simply copy any task from /gulp/tasks to /gulp active-tasks
 *  or add you own task to /gulp/active-tasks
 */

// require the boilerplate passing in the basepath,
// the .gulpfile dir is the default base path
var gulp = require('./gulp')();

// define high-level tasks here
// copy-ref-templates task is included in copy-assets.js file
gulp.task('build', ['build-scripts', 'copy-assets', 'copy-ref-templates', 'build-style', 'test']);
gulp.task('watch', ['build-scripts', 'copy-assets', 'copy-ref-templates', 'build-style', 'test', 'dev-watch']);