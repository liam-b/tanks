var gulp = require('gulp')
var sass = require('gulp-sass')
var pug = require('gulp-pug')
var webpack = require('webpack-stream')
var ghPages = require('gulp-gh-pages');

gulp.task('deploy', ['sass', 'webpack', 'pug'], function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({message: 'deployed to gh-pages'}))
})

gulp.task('sass', function () {
  return gulp.src('app/scss/**/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('dist/css/'))
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
  gulp.watch('app/scss/**/*.sass', ['sass'])
  gulp.watch('app/js/**/*.js', ['webpack'])
  gulp.watch('app/*.pug', ['pug'])
})
