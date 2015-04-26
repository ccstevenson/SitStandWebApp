var gulp = require('gulp'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload');

gulp.task('less', function() {
  gulp.src('less/*.less')
    .pipe(less())
    .pipe(gulp.dest('css'))
    .pipe(livereload());
});


gulp.task('reload', function() {
   livereload.reload();
});

gulp.task('default', function() {
  livereload.listen();
  gulp.watch('less/*.less', ['less']);
  gulp.watch('app/**/*.js', ['reload']);
  gulp.watch('app/**/*.html', ['reload']);
});