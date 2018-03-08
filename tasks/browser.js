'use strict';

module.exports = params => {
    var { gulp, target, browserSync } = params;
    gulp.task('browser', () => browserSync({
        open: false,
        server: target,
        notify: false
    }));
};