'use strict';

var packageJSON     = require('./package.json'),
  gulp              = require('gulp'),
  glob              = require('glob'),
  plumber           = require('gulp-plumber'),
  notify            = require('gulp-notify'),
  source            = packageJSON.config.directories.source,
  target            = packageJSON.config.directories.production,
  browserSync	    = require('browser-sync'),
  browserList       = packageJSON.config.browsers;      


glob.sync('./tasks/**/*.js').map(file => require(file)({
  packageJSON,
  gulp,
  source,
  target,
  plumber,
  notify,
  browserSync,
  browserList
}));

gulp.task('default', () => {
  gulp.start('serve');
}).task('serve', ['clean'], ()  => {
  gulp.start('html', 'css', 'js', 'watch', 'browser');
}).task('build', ['clean'], () => {
  gulp.start('html', 'css', 'js');
});