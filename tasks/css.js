'use strict';

var sass            = require('gulp-sass'),
    postcss         = require('gulp-postcss'),
    autoprefixer    = require('autoprefixer');

module.exports = params => {
  var { gulp, source, target, plumber, notify, gulpif, browserSync, browserList } = params;
  gulp.task('css', () => {
    gulp.src([
      source + '/_styles/*.{sass,scss}',
      '!' + source + '/_styles/_*.{sass,scss}'
    ])
    .pipe(plumber({
      errorHandler: notify.onError({
        sound: false,
        title: 'css',
        message: error => error.message
      })
    }))
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(postcss([
       autoprefixer({ browsers: browserList })
    ]))
    .pipe(gulp.dest(target + '/styles'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
  });
};