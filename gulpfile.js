var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var htmlreplace = require('gulp-html-replace');
var browserSync = require('browser-sync').create();

var path = {
  HTML: 'src/index.html',
  ALL: ['src/js/*.js', 'src/js/**/*.js', 'src/index.html'],
  JS: ['src/js/*.js', 'src/js/**/*.js'],
  MINIFIED_OUT: 'build.min.js',
  DEST_SRC: 'dist/src',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};
gulp.task('transform', function(){
  gulp.src(path.JS)
    .pipe(react())
    .pipe(gulp.dest(path.DEST_SRC));
});
gulp.task('copy', function(){
  gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
});
// create a task that ensures the `js` task is complete before
// reloading browsers
gulp.task('watch4transform', ['transform'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('watch4copy', ['copy'], function (done) {
    browserSync.reload();
    done();
});


gulp.task('dev', ['transform', 'copy'], function(next) {
    console.log("dev done...");
    next();
});

gulp.task('build', function(){
  gulp.src(path.JS)
    .pipe(react())
    .pipe(concat(path.MINIFIED_OUT))
    .pipe(uglify(path.MINIFIED_OUT))
    .pipe(gulp.dest(path.DEST_BUILD));
});
gulp.task('replaceHTML', function(){
  gulp.src(path.HTML)
    .pipe(htmlreplace({
      'js': 'build/' + path.MINIFIED_OUT
    }))
    .pipe(gulp.dest(path.DEST));
});
gulp.task('default', ['dev']);
gulp.task('production', ['replaceHTML', 'build']);

gulp.task('serve', ['dev'], function (done) {

    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: path.DEST
        }
    });

    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch(path.JS, ['watch4transform']);

    gulp.watch(path.HTML, ['watch4copy']);

});
