'use strict';

module.exports = params => {
  var { gulp, source } = params;
  gulp.task('watch', () => {
    gulp.watch(source + '/**/*.html', ['html']);
    gulp.watch(source + '/**/*.{sass,scss}', ['css']);
    gulp.start('watchify');
  });
};