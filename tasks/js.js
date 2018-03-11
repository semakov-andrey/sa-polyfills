'use strict';

var browserify              = require('browserify'),
  babelify                  = require('babelify'),
  vsource                   = require('vinyl-source-stream'),
  buffer                    = require('vinyl-buffer'),
  watchify                  = require('watchify'),
  util                      = require('gulp-util');

module.exports = params => {
  var { gulp, source, target, notify, browserSync } = params,
  bundler = watchify(browserify(source + '/_scripts/main.js', { debug: false })).transform(babelify, { presets: ['env'] }),
  rebundle = bundler => {
    let startTime = new Date().getTime();
    bundler.bundle()
    .on('error', notify.onError({
      sound: false,
      title: 'js',
      message: error => error.message
    }))
    .pipe(vsource('main.js'))
    .pipe(buffer())
    .pipe(gulp.dest(target + '/scripts'))
    .on('end', () => {
      let time = (new Date().getTime() - startTime) / 1000;
      console.log('[' + util.colors.gray((new Date()).getHours() + ':' + (new Date()).getMinutes() + ':' + (new Date()).getSeconds()) + '] '
        + 'JS was browserified after ' 
        + util.colors.magenta(time + 's'));
      browserSync.reload();
    });
  }
  gulp.task('js', () => {
    rebundle(bundler);
  }).task('watchify', () => {
    bundler.on('update', () => {
      rebundle(bundler);
    });
  });
};