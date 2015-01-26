var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var uglify = require('gulp-uglifyjs');
var webpack = require('gulp-webpack');

var paths = {
    src: [
        './src/core.js',
        './src/input.js',
        './src/graphics.js',
        './src/sound.js'
    ],

    editor: ['editor/**/*.jsx', 'editor/**/*.js']
};

gulp.task('default', ['test']);
gulp.task('test', ['jscs', 'jshint']);
gulp.task('build', ['compress', 'build-editor']);
gulp.task('start', ['watch']);

gulp.task('jscs', function() {
    return gulp.src('./src/*.js')
        .pipe(jscs());
});

gulp.task('jshint', function() {
    return gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default', { verbose: true }))
        .pipe(jshint.reporter('fail'));
});

gulp.task('compress', function() {
    gulp.src(paths.src)
        .pipe(uglify('micron.js', {
            output: {
                beautify: true
            },
            compress: false,
            mangle: false
        }))
        .pipe(gulp.dest('build'))
        .pipe(uglify('micron.min.js', {
            outSourceMap: true
        }))
        .pipe(gulp.dest('build'));

});

gulp.task('watch', function() {
    gulp.watch(paths.src, ['compress']);
    gulp.watch(paths.editor, ['build-editor']);
});

gulp.task('build-editor', function() {
    var webpack = require('gulp-webpack');

    return gulp.src('./editor/app/bootstrap.jsx')
        .pipe(webpack({
            module: {
                loaders: [
                    {
                        test: /\.jsx$/,
                        loader: 'jsx-loader?insertPragma=React.DOM&harmony'
                    }
                ]
            },
            output: {
                filename: 'app-bundled.js'
            }
        }))
        .pipe(gulp.dest('./editor'));
});
