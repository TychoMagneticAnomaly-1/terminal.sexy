var log = require('log_');
var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var sequence = require('run-sequence');
var autoprefix = require('gulp-autoprefixer');
var browserify = require('gulp-faster-browserify');

gulp.task('default', function (cb) {
  return sequence(['sass', 'libs', 'scripts', 'jade'], cb);
});

gulp.task('watch', ['default'], function () {
  gulp.watch('stylesheets/**/*.scss', ['sass']);
  gulp.watch('scripts/**/*.js', ['scripts']);
  gulp.watch('jade/**.jade', ['jade']);
});

gulp.task('connect', ['watch'], function () {
  connect.server({
    root: ['dist'],
    port: 8000,
    livereload: true
  });
});

gulp.task('jade', function () {
  return gulp.src('jade/*.jade')
    .pipe(jade({ pretty: true }))
    .on('error', log('jade', 'yellow'))
    .pipe(gulp.dest('dist/'))
    .pipe(connect.reload());
});

gulp.task('sass', function () {
  return gulp.src('stylesheets/main.scss')
    .pipe(sass({ outputStyle: 'compressed', errLogToConsole: true }))
    .pipe(autoprefix())
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('scripts', function () {
  return gulp.src('scripts/app.js')
    .pipe(browserify({ standalone: 'App' }))
    .on('error', log('browserify', 'blue'))
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload());
});

gulp.task('minify', function () {
  return gulp.src('dist/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});
