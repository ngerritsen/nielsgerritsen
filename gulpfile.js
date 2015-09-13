var gulp = require('gulp');
var autoprefixer = require('autoprefixer-core');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var browserSync = require('browser-sync').create();
var minimist = require('minimist');
var runSequence = require('run-sequence');
var ftp = require('vinyl-ftp');
var del = require('del');

var $ = require('gulp-load-plugins')();
var args = minimist(process.argv.slice(2));

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

gulp.task('copy-font-awesome', function () {
    gulp.src('./app/bower_components/fontawesome/css/font-awesome.css')
        .pipe(gulp.dest('./app/styles'));
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

gulp.task('dev-fonts', function () {
    return gulp.src('app/**/*.{eot,svg,ttf,woff}')
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('app/fonts'))
        .pipe($.size());
});

gulp.task('ftp', function () {
    var remotePath = '/public_html/nielsgerritsen/';
    var conn = ftp.create({
        host: 'carehr.nl',
        user: args.user,
        pass: args.password,
        log: $.util.log
    });

    return gulp.src(['./dist/**'])
        .pipe(conn.newer(remotePath))
        .pipe(conn.dest(remotePath));
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

gulp.task('clean', function (cb) {
    del(['./dist/**'], cb);
});

gulp.task('default', ['sass', 'jshint', 'bundle', 'images', 'serve', 'copy-font-awesome', 'dev-fonts', 'watch']);

gulp.task('watch', function () {
    gulp.watch('app/styles/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch(['app/scripts/**/*.js', '!app/scripts/bundle.js'], ['jshint', 'bundle']);
    gulp.watch('app/images/**/*', ['images']);
});

gulp.task('build', function () {
    runSequence(
        'clean',
        'jshint',
        ['html', 'sass', 'bundle', 'images', 'files', 'fonts', 'copy-font-awesome'],
        ['minify-css', 'minify-js']
    );
});
