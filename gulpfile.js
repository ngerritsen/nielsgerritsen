'use strict'

const fs = require('fs')
const gulp = require('gulp')
const path = require('path')
const autoprefixer = require('autoprefixer')
const browserify = require('browserify')
const source = require('vinyl-source-stream')
const browserSync = require('browser-sync').create()
const runSequence = require('run-sequence')
const rimraf = require('rimraf')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminOptipng = require('imagemin-pngquant')

const plugins = require('gulp-load-plugins')()
const browsers = [
  'last 2 versions',
  'ie > 10'
]

let env = 'production'
let dest = './dist'

gulp.task('lint', () => {
  return gulp.src(['./src/scripts/*.js', './*.js'])
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.if(env === 'production', plugins.eslint.failAfterError()))
})

gulp.task('sass', () => {
  return gulp.src('src/styles/main.scss')
    .pipe(
      plugins.sass({
        sourcemap: env === 'development',
        outputStyle: env === 'production' ? 'compressed' : 'expanded'
      })
        .on('error', plugins.sass.logError)
    )
    .pipe(plugins.postcss([
      autoprefixer({ browsers })
    ]))
    .pipe(gulp.dest(path.join(dest, 'css')))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('js', () => {
  let bundler = browserify({
    entries: './src/scripts/main.js'
  })
    .transform('babelify', {
      presets: [
        ['env', {
          targets: { browsers }
        }]
      ]
    })

  if (env === 'production') {
    bundler = bundler.transform({ global: true }, 'uglifyify')
  }

  return bundler.bundle()
    .on('error', err => {
      plugins.utils.log('Error : ' + err.message)
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(path.join(dest, 'js')))
})

gulp.task('files', () => {
  return gulp.src('src/files/**/*')
    .pipe(gulp.dest(path.join(dest, 'files')))
})

gulp.task('favicon', () => {
  return gulp.src(['src/favicon.ico'])
    .pipe(gulp.dest(dest))
})

gulp.task('images', () => {
  return gulp.src('src/images/**/*')
    .pipe(plugins.imagemin([
      imageminMozjpeg(),
      imageminOptipng()
    ]))
    .pipe(gulp.dest(path.join(dest, 'images')))
})

gulp.task('fonts', () => {
  return gulp.src('src/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(plugins.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe(plugins.flatten())
    .pipe(gulp.dest(path.join(dest, 'fonts')))
})

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './.tmp'
    }
  })
})

gulp.task('html', () => {
  gulp.src('./src/index.ejs')
    .pipe(
      plugins.ejs({
        buildNumber: process.env.TRAVIS_BUILD_NUMBER,
        criticalCssPath: path.join(dest, 'css/main.css'),
        fs,
        env
      }, null, { ext: '.html' })
        .on('error', plugins.util.log)
    )
    .pipe(gulp.dest(dest))
})

gulp.task('default', () => {
  dest = './.tmp'
  env = 'development'

  runSequence(
    ['sass', 'js', 'images', 'files', 'fonts', 'favicon'],
    ['html', 'watch'],
    ['serve']
  )
})

gulp.task('watch', () => {
  gulp.watch('src/styles/**/*.scss', ['sass'])
  gulp.watch('src/scripts/**/*.js', ['lint', 'js'])
  gulp.watch('src/images/**/*', ['images'])
  gulp.watch(['src/index.ejs', path.join(dest, '**/*.{js,css}')], ['html'])
})

gulp.task('build')

gulp.task('build', () => {
  rimraf('dist', () => {
    runSequence(
      ['sass', 'js', 'images', 'files', 'fonts', 'favicon'],
      ['html']
    )
  })
})
