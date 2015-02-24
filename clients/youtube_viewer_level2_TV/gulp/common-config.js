var path = require('path');

var SINGLE_DIST_DIR = '../../public/youtube_viewer_level2_TV';
var VIEWS_DIST_DIR = '../../app/com/yetu/youtube/views';

// create dist-based path
var dist = function(dir){
    var args = Array.prototype.slice.call(arguments);
    args.unshift(dir);
    return path.join.apply(path, args);
}

var distAssets = function(){
    return dist(SINGLE_DIST_DIR);
};

// paths for scripts tasks
var scripts = {
    build: {
        src: 'app-bundle.js',
        dest: distAssets('/')
    },
    dev: {
        src: 'app-bundle.js',
        dest: 'bundle-js'
    },
    watch: 'js/**'
};

// paths for styles tasks
var styles = {
    build: {
        src: 'styles/app.styl',
        dest: distAssets('/')+'/styles'
    },
    watch: 'styles/**'
};

var fonts = {
    build: {
        src: 'styles/fonts/*',
        dest: distAssets('/')
    }

};

var views = {
    build: {
        src: '*.scala.html',
        dest: VIEWS_DIST_DIR
    },
    watch: '*.scala.html'
};

var img = {
    build: {
        src: 'img/*',
        dest: distAssets('/')
    },
    watch: 'img/*'
};
var templates = {
    build: {
        src: 'js/*.html',
        dest: distAssets('/')
    },
    watch: 'js/*.html'
};

module.exports = {
    path: {
        dist : SINGLE_DIST_DIR,
        styles: styles,
        scripts: scripts,
        views: views,
        img: img,
        templates: templates,
        fonts: fonts,
        tests: {
            src: 'test/**.spec.js',
            configDir: 'test'
        }
    }
};