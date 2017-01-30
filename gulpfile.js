var gulp = require('gulp')
var sass = require('gulp-sass')
var pug = require('gulp-pug')
var babel = require('gulp-babel')

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

gulp.task('js', function () {
  return gulp.src('app/js/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist/js'))
})

gulp.task('watch', ['sass', 'js', 'pug'], function () {
  gulp.watch('app/scss/**/*.scss', ['sass'])
  gulp.watch('app/js/**/*.js', ['js'])
  gulp.watch('app/*.pug', ['pug'])
})
