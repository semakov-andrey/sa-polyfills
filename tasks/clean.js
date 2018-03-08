'use strict';

var clean           = require('gulp-clean');

module.exports = params => {
  var { gulp, target } = params;
  gulp.task('clean', () => {
    return gulp.src(target, {read: false})
      .pipe(clean());
  });
};