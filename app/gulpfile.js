var gulp = require('gulp');
var sass = require('gulp-sass');
var server = require('./server');
var config = require('./config');

gulp.task('styles', function() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch_styles', function() {
  gulp.watch('./scss/**/*.scss', ['styles']);
  gulp.watch('./views/**/*.jade', notifyLiveReload);
  gulp.watch('./public/css/*.css', notifyLiveReload);
});

gulp.task('express', function() {
  var app = server.app;
  app.use(require('connect-livereload')({port: 35729}));
  app.listen(config.port);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);

  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}

var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(35729);
});

gulp.task('default', ['watch_styles', 'express', 'livereload']);