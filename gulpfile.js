var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

gulp.task('default', ['test']);
gulp.task('test', ['jscs', 'jshint']);

gulp.task('jscs', function() {
    return gulp.src('./src/*.js')
        .pipe(jscs());
});

gulp.task('jshint', function() {
    return gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }));
});
