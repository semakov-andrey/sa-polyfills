'use strict';

module.exports = params => {
  var { gulp, source, target, browserSync } = params;
  gulp.task('html', () => {
    gulp.src(source + '/*.html')
      .pipe(gulp.dest(target))
      .on('end', browserSync.reload);
  });
};