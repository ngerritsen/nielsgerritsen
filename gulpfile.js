'use strict';
// generated on 2014-08-26 using generator-gulp-webapp 0.1.0

var gulp = require('gulp'),
    autoprefixer = require('autoprefixer-core'),
    postcss = require('postcss'),
    browserSync = require('browser-sync').create();

// load plugins
var $ = require('gulp-load-plugins')();


gulp.task('sass', function(){
    return gulp.src('app/styles/main.scss')
        .pipe($.sass({
            sourcemap: true,
            style: 'compact'
        }).on('error', $.sass.logError))
        .pipe($.postcss([ autoprefixer({ browsers: ["> 0%"] }) ]))
        .pipe(gulp.dest('app/styles'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('scripts', function () {
    return gulp.src('app/scripts/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(require('jshint-stylish')))
        .pipe($.size());
});


gulp.task('files', function () {
    return gulp.src('app/files/**/*')
        .pipe(gulp.dest('dist/files'))
        .pipe($.size());
});

gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(gulp.dest('dist'))
});

gulp.task('copy-bower-components', function () {
    gulp.src('./app/bower_components/**')
        .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('minify-css', function() {
    var opts = {comments:true,spare:true};
    gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
        .pipe($.minifyCss(opts))
        .pipe(gulp.dest('./dist/'))
        .pipe($.size({
            showFiles: true,
            title: 'CSS output file(s):'
        }));
});

gulp.task('minify-js', function() {
    gulp.src('./app/scripts/main.js')
        .pipe($.uglify())
        .pipe(gulp.dest('./dist/scripts/'))
        .pipe($.size({
            showFiles: true,
            title: 'JS output file(s):'
        }));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
        .pipe($.size());
});

gulp.task('fonts', function () {
    return gulp.src('app/**/*.{eot,svg,ttf,woff}')
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'))
        .pipe($.size());
});

gulp.task('clean', function () {
    return gulp.src(['dist'], { read: false }).pipe($.clean());
});

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('default', ['sass', 'scripts', 'images', 'serve', 'watch']);

gulp.task('watch', function () {
    gulp.watch('app/styles/**/*.scss', ['sass']);
    gulp.watch('app/scripts/**/*.js', ['scripts']);
    gulp.watch('app/images/**/*', ['images']);
});

gulp.task('build', [ 'html', 'sass', 'scripts', 'images', 'files', 'fonts', 'minify-css', 'minify-js', 'copy-bower-components']);
