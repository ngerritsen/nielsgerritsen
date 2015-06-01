var gulp = require('gulp');
var autoprefixer = require('autoprefixer-core');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();

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

gulp.task('bundle', function() {
    return browserify({
        entries: './app/scripts/main.js'
    })
        .bundle()
        .on("error", function (err) { console.log("Error : " + err.message); })
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./app/scripts'));
});

gulp.task('jshint', function () {
    return gulp.src(['app/scripts/**/*.js', '!app/scripts/bundle.js'])
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
    return gulp.src(['app/*.html', 'app/*.ico'])
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
    gulp.src('./app/scripts/bundle.js')
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

gulp.task('default', ['sass', 'jshint', 'bundle', 'images', 'serve', 'watch']);

gulp.task('watch', function () {
    gulp.watch('app/styles/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch(['app/scripts/**/*.js', '!app/scripts/bundle.js'], ['jshint', 'bundle']);
    gulp.watch('app/images/**/*', ['images']);
});

gulp.task('build', [ 'html', 'sass', 'jshint', 'bundle', 'images', 'files', 'fonts', 'minify-css', 'minify-js', 'copy-bower-components']);
