var config = require('config');
var debug = require('debug')('app:gulp');
var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglifycss = require('gulp-uglifycss');
var mainBowerFiles = require('gulp-main-bower-files');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpFilter = require('gulp-filter');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var babelLoader = require('babel-loader');
var livereload = require('tiny-lr')();

var webpackConfig = require('./webpack.config');

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);
  fileName = fileName.replace('public/', '');
  debug('Reloading ' + fileName);

  livereload.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('libraries.js', function () {
  var filterJS = gulpFilter('**/*.js', { restore: true });
  gulp.src('./bower.json')
    .pipe(mainBowerFiles())
    .pipe(filterJS)
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('libraries.css', function () {
  var filterCSS = gulpFilter('**/*.css', { restore: true });
  gulp.src('./bower.json')
    .pipe(mainBowerFiles())
    .pipe(filterCSS)
    .pipe(concat('libs.css'))
    .pipe(uglifycss())
    .pipe(gulp.dest('./public/styles/'))
});

gulp.task('styles', function () {
  gulp.src('./client/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/styles'))
});

gulp.task('styles.build', function () {
  return gulp.src('./client/components/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(uglifycss())
    .pipe(gulp.dest('./public/styles/'));
});

gulp.task('scripts', function () {
  webpackConfig.watch = true;

  return gulp.src('./client/app.js')
    .pipe(webpackStream( webpackConfig ))
    .pipe(gulp.dest('./public/scripts/'))
});

gulp.task('scripts.build', function () {
  return gulp.src('./client/app.js')
    .pipe(webpackStream( webpackConfig ))
    .pipe(uglify())
    .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('watch', function () {
  livereload.listen(config.get('app.livereload.port'));

  gulp.watch([
    './client/app.scss',
    './client/components/**/*.scss'
  ], ['styles']);

  gulp.watch([
    './client/app.js',
    './client/components/**/*.js'
  ], ['scripts']);

  gulp.watch([
    './public/styles/app.css',
    './public/scripts/app.js'
  ], notifyLiveReload);

  gulp.watch([
    './bower_components/**/*.js',
    './bower_components/**/*.css'
  ], ['libraries.js', 'libraries.css']);
});

gulp.task('server', function () {
  require('gulp-connect').server({
    root: './public',
    port: config.get('app.port') || 3000
  })
});

/**
 * Main tasks
 */
gulp.task('default', ['dev']);
gulp.task('build', ['libraries.js', 'libraries.css', 'scripts.build', 'styles.build']);
gulp.task('dev', ['libraries.js', 'libraries.css', 'scripts', 'styles', 'watch']);