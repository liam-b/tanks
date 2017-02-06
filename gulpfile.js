var gulp = require('gulp')
var sass = require('gulp-sass')
var pug = require('gulp-pug')
var webpack = require('webpack-stream')

gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'))
})

gulp.task('pug', function () {
  return gulp.src('app/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist/'))
})

gulp.task('webpack', function () {
  return gulp.src('app/js/index.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
})

gulp.task('watch', ['sass', 'webpack', 'pug'], function () {
  gulp.watch('app/scss/**/*.scss', ['sass'])
  gulp.watch('app/js/**/*.js', ['webpack'])
  gulp.watch('app/*.pug', ['pug'])
})
