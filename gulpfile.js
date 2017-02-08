const gulp = require('gulp')
const autoprefixer = require('autoprefixer')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const browserSync = require('browser-sync').create()
const minimist = require('minimist')
const runSequence = require('run-sequence')
const ftp = require('vinyl-ftp')
const rimraf = require('rimraf')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminOptipng = require('imagemin-pngquant')

const $ = require('gulp-load-plugins')()
const args = minimist(process.argv.slice(2))

gulp.task('sass', function(){
  return gulp.src('app/styles/main.scss')
    .pipe($.sass({
      sourcemap: true,
      style: 'compact'
    }).on('error', $.sass.logError))
    .pipe($.postcss([ autoprefixer({ browsers: ["> 0%"] }) ]))
    .pipe(gulp.dest('app/styles'))
    .pipe(browserSync.reload({stream:true}))
})

gulp.task('bundle', function() {
  return browserify({
    entries: './app/scripts/main.js'
  })
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message) })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./app/scripts'))
})

gulp.task('jshint', function () {
  return gulp.src(['app/scripts/**/*.js', '!app/scripts/bundle.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')))
    .pipe($.size())
})


gulp.task('files', function () {
  return gulp.src('app/files/**/*')
    .pipe(gulp.dest('dist/files'))
    .pipe($.size())
})

gulp.task('html', function () {
  return gulp.src(['app/*.html', 'app/*.ico'])
    .pipe(gulp.dest('dist'))
})

gulp.task('copy-font-awesome', function () {
  gulp.src('./app/bower_components/fontawesome/css/font-awesome.css')
    .pipe(gulp.dest('./app/styles'))
})

gulp.task('minify-css', function() {
  const opts = {comments:true,spare:true}
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe($.minifyCss(opts))
    .pipe(gulp.dest('./dist/'))
    .pipe($.size({
      showFiles: true,
      title: 'CSS output file(s):'
    }))
})

gulp.task('minify-js', function() {
  gulp.src('./app/scripts/bundle.js')
    .pipe($.uglify())
    .pipe(gulp.dest('./dist/scripts/'))
    .pipe($.size({
      showFiles: true,
      title: 'JS output file(s):'
    }))
})

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.imagemin([
      imageminMozjpeg(),
      imageminOptipng()
    ]))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size())
})

gulp.task('fonts', function () {
  return fonts('dist/fonts')
})

gulp.task('dev-fonts', function () {
  return fonts('app/fonts')
})

function fonts (dest) {
  return gulp.src('app/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(dest))
    .pipe($.size())
}

gulp.task('ftp', function () {
  const remotePath = '/public_html/nielsgerritsen/'
  const conn = ftp.create({
      host: 'carehr.nl',
      user: args.user,
      pass: args.password,
      log: $.util.log
  })

  return gulp.src(['./dist/**'])
    .pipe(conn.newer(remotePath))
    .pipe(conn.dest(remotePath))
})

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  })
})

gulp.task('default', ['sass', 'jshint', 'bundle', 'images', 'serve', 'copy-font-awesome', 'dev-fonts', 'watch'])

gulp.task('watch', function () {
  gulp.watch('app/styles/**/*.scss', ['sass'])
  gulp.watch('app/*.html', browserSync.reload)
  gulp.watch(['app/scripts/**/*.js', '!app/scripts/bundle.js'], ['jshint', 'bundle'])
  gulp.watch('app/images/**/*', ['images'])
})

gulp.task('build', function () {
  rimraf('dist', function () {
    runSequence(
      'jshint',
      ['html', 'sass', 'bundle', 'images', 'files', 'fonts', 'copy-font-awesome'],
      ['minify-css', 'minify-js']
    )
  })
})
