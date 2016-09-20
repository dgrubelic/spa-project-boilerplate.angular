var config = require('config');
var debug = require('debug')('app:gulp');
var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var uglifycss = require('gulp-uglifycss');
var mainBowerFiles = require('gulp-main-bower-files');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gulpFilter = require('gulp-filter');
var plumber = require('gulp-plumber');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var babelLoader = require('babel-loader');
var livereload = require('tiny-lr')();
var htmlMin = require('gulp-htmlmin');
var ngAnnotate = require('gulp-ng-annotate');

var webpackConfig = require('./webpack.config');

/**
 * Default error handler
 * @param  {Object} err Error object
 * @return {void}
 */
function errorHandler(err) {
  console.error(err);
}

/**
 * Live reload trigger
 * @param  {Object} event Event
 * @return {void}
 */
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
    .on('error', errorHandler)
    .pipe(plumber(errorHandler))
    .pipe(mainBowerFiles())
    .pipe(filterJS)
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('libraries.css', function () {
  var filterCSS = gulpFilter('**/*.css', { restore: true });
  gulp.src('./bower.json')
    .on('error', errorHandler)
    .pipe(plumber(errorHandler))
    .pipe(mainBowerFiles())
    .pipe(filterCSS)
    .pipe(concat('libs.css'))
    .pipe(uglifycss())
    .pipe(gulp.dest('./public/styles/'))
});

gulp.task('styles', function () {
  gulp.src('./client/app.scss')
    .on('error', errorHandler)
    .pipe(plumber(errorHandler))
    .pipe(sourcemaps.init())
    .pipe(sass({ errLogToConsole: true }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/styles'))
});

gulp.task('styles.build', function () {
  return gulp.src('./client/components/app.scss')
    .on('error', errorHandler)
    .pipe(plumber(errorHandler))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(uglifycss())
    .pipe(gulp.dest('./public/styles/'));
});

gulp.task('scripts', function () {
  webpackConfig.watch = true;

  return gulp.src('./client/app.js')
    .on('error', errorHandler)
    .pipe(plumber(errorHandler))
    .pipe(webpackStream( webpackConfig ))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('./public/scripts/'))
});

gulp.task('scripts.build', function () {
  webpackConfig.watch = false;

  return gulp.src('./client/app.js')
    .on('error', errorHandler)
    .pipe(plumber(errorHandler))
    .pipe(webpackStream( webpackConfig ))
    .pipe(ngAnnotate())
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
    './client/components/**/*.html'
  ], ['templates']);

  gulp.watch([
    './public/styles/app.css',
    './public/scripts/app.js'
  ], notifyLiveReload);

  gulp.watch([
    './bower_components/**/*.js',
    './bower_components/**/*.css'
  ], ['libraries.js', 'libraries.css']);
});

gulp.task('templates', function () {
  return gulp.src('./client/components/**/*.html')
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./public/views'));
});

/**
 * Main tasks
 */
gulp.task('default', ['dev']);
gulp.task('build', ['libraries.js', 'libraries.css', 'templates', 'scripts.build', 'styles.build']);
gulp.task('dev', ['libraries.js', 'libraries.css', 'templates', 'scripts', 'styles', 'watch']);
