'use strict'

//------------------------------------------------------------------------------
//GULP Settings
//------------------------------------------------------------------------------


var gulpSettings = {


  //Node and bower----------------------------

    bowerPath: './bower_components/',
    nodePath: './node_modules',

  //Vendor paths------------------------------

    sourceVendor: './source/vendor/',
    publicVendor: './public/vendor/',

  //Browsersync-------------------------------

      RunBrowserSync: true,
      browsers: ['chrome'],
      domain:'localhost/testtheme/', //If localhost use 'localhost/"yourAppFolder"'
      port:4000,
      syncFeatures: {
        clicks: true,
        forms: true,
        scroll: true
      },

  //PHP---------------------------------------

      phpPath: './**/*.php',

  //Sass and CSS-----------------------------

      //Path to sass files
      sassPath: './source/sass/**/*.scss',
      //Path to CSS
      cssPath: './public/css/',

  //Javascript------------------------------

      jsCompress: false,
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
var babelify = require('babelify');
var fs = require('fs');
var imagemin = require('imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminJpegtran = require('imagemin-jpegtran');


//------------------------------------------------------------------------------
// SASS TASK (Running autoprefixer, cssmin, rename and gulpif)
//------------------------------------------------------------------------------

gulp.task('sass', function() {
  gulp.src(gulpSettings.sassPath)
  .pipe(plumber())
  .pipe(sass())
  .pipe(autoprefixer({
      browsers: ['last 2 versions','> 5%'],
      cascade: false
  }))
  .pipe(gulp.dest(gulpSettings.cssPath))
  .pipe(cssmin())
  .pipe(rename({ suffix:".min" }))
  .pipe(gulp.dest(gulpSettings.cssPath))
  .pipe(browserSync.stream());
});


//------------------------------------------------------------------------------
// JS TASK
//------------------------------------------------------------------------------

gulp.task('js', function (){
  browserify({ debug: true })
    .transform(babelify)
    .require( gulpSettings.srcJsPath , { entry: true })
    .bundle()
    .pipe(plumber())
    .pipe(gulpif(
      gulpSettings.jsCompress ,
            fs.createWriteStream( gulpSettings.publicJsCompPath + 'app.min.js' ),
            fs.createWriteStream( gulpSettings.publicJsPath + 'app.js' )
      )
    );
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
  });

});


//------------------------------------------------------------------------------
//IMAGES
//------------------------------------------------------------------------------

gulp.task('image-opt', function() {
  return gulp.src( gulpSettings.srcImagePath )
  .pipe(plumber())
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
  gulp.watch( gulpSettings.sassPath , ['sass']);
  gulp.watch( gulpSettings.srcJsPath , ['js']).on('change', browserSync.reload);
  gulp.watch( gulpSettings.phpPath).on('change', browserSync.reload);
  gulp.watch( gulpSettings.publicImagePath, ['image-opt']).on('change', browserSync.reload);
});

gulp.task('default', gulpif(  gulpSettings.RunBrowserSync,
    ['sass','js','browser-sync','image-opt','watch'] ,
    ['sass','js','image-opt','watch']
  )
);
