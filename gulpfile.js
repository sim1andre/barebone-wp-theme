'use strict'

//------------------------------------------------------------------------------
//GULP Settings
//------------------------------------------------------------------------------


var gulpSettings = {

    development: true,

  //Node and bower----------------------------

    bowerPath: './bower_components/',
    nodePath: './node_modules',

  //Vendor paths------------------------------

    sourceVendor: './source/vendor/',
    publicVendor: './public/vendor/',

  //Browsersync-------------------------------

      RunBrowserSync: true,
      browsers: ['chrome'],
      domain:'localhost/testtheme/', //'localhost/"yourAppFolder"'
      port:4000,
      syncFeatures: {
        clicks: true,
        forms: true,
        scroll: true,
        location: true
      },

  //PHP---------------------------------------

      phpPath: './**/*.php',

  //Sass and CSS-----------------------------

      sassPath: './source/sass/**/*.scss',
      cssPath: './public/css/',

  //Javascript------------------------------

      srcJsPath: './source/js/app.js',
      publicJsPath: './public/js/',
      publicJsCompPath: './public/js/',

  //Images--------------------------------

      srcImagePath: './source/images/*.{png,jpg,gif}',
      publicImagePath: './public/images/'
}


//------------------------------------------------------------------------------
//REQUIRED MODULES
//------------------------------------------------------------------------------

var gulp  = require('gulp');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var gulpif = require('gulp-if');
var scsslint = require('gulp-scss-lint');
var sass  = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var sourcemap = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var fs = require('fs');
var imagemin = require('imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegtran = require('imagemin-jpegtran');


//------------------------------------------------------------------------------
// SASS TASK (Running autoprefixer, cssmin, rename and gulpif)
//------------------------------------------------------------------------------

gulp.task('sass', function() {
  gulp.src(gulpSettings.sassPath)
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sass())
  .pipe(autoprefixer({
      browsers: ['last 2 versions','> 5%'],
      cascade: false
  }))
  .pipe(gulpif( !gulpSettings.development , cssmin()))
  .pipe(gulpif( !gulpSettings.development, rename({ suffix:".min" })))
  .pipe(gulp.dest(gulpSettings.cssPath))
  .pipe(browserSync.stream())
  .pipe(notify({ message: 'Injected css into browser(s) (<%= file.relative %>)'}));
});


//------------------------------------------------------------------------------
// JS TASKS
//------------------------------------------------------------------------------

gulp.task('js', function (){
  return browserify({entries: gulpSettings.srcJsPath, debug: true })
    .transform(babelify)
    .bundle()
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(source('app.js'))
    .pipe(gulpif( !gulpSettings.development, streamify(uglify())))
    .pipe(gulpif( !gulpSettings.development, rename({ suffix:'.min' })))
    .pipe(gulp.dest( gulpSettings.publicJsPath ));
});


//------------------------------------------------------------------------------
//Browser Sync
//------------------------------------------------------------------------------

gulp.task('browser-sync', function() {

  browserSync.init({
      proxy: {
        target: gulpSettings.domain,
      },
      port: gulpSettings.port,
      browser: gulpSettings.browsers,
      ghostMode: gulpSettings.syncFeatures,
      injectChanges: true
  });

});


//------------------------------------------------------------------------------
//IMAGES
//------------------------------------------------------------------------------

gulp.task('image-opt', function() {
  return gulp.src( gulpSettings.srcImagePath )
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(imageminPngquant({ quality: '60-80', speed: 4})())
  .pipe(imageminJpegtran({ progressive: true})())
  .pipe(gulp.dest( gulpSettings.publicImagePath ));
});


//------------------------------------------------------------------------------
//IMPORT FOUNDATION TASKS
//------------------------------------------------------------------------------

//Imports foundation css into public/css folder
gulp.task('foundation-css', function () {
  return gulp.src(gulpSettings.bowerPath + 'foundation/css/**/**.*')
  .pipe(gulp.dest(gulpSettings.publicVendor + 'foundation'));
});

//Imports foundation sass into source/css folder
gulp.task('foundation-sass', function () {
  return gulp.src(gulpSettings.bowerPath + 'foundation/scss/**/**.*')
  .pipe(gulp.dest(gulpSettings.sourceVendor + 'foundation'));
});

//Imports foundation js into source/js folder
gulp.task('foundation-js', function () {
  return gulp.src(appSettings.bowerDir + 'foundation/js/**/**.*')
  .pipe(gulp.dest(appSettings.sourceVendor + 'foundation'));
});



//------------------------------------------------------------------------------
//WATCH
//------------------------------------------------------------------------------

gulp.task('watch', function() {
  gulp.watch( gulpSettings.sassPath , ['sass']).on('change', browserSync.reload);
  gulp.watch( gulpSettings.srcJsPath , ['js']).on('change', browserSync.reload);
  gulp.watch( gulpSettings.phpPath).on('change', browserSync.reload);
  gulp.watch( gulpSettings.publicImagePath, ['image-opt']).on('change', browserSync.reload);
});

gulp.task('default', gulpif(  gulpSettings.RunBrowserSync,
    ['sass','js','browser-sync','image-opt','watch'],
    ['sass','js','image-opt','watch']
  )
);
