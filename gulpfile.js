'use strict'

//------------------------------------------------------------------------------
//GULP Settings
//------------------------------------------------------------------------------


var gulpSettings = {

    development: true,
    runBrowserSync: true,
    useJade: false,
    ftpAutoUpload: false,

  //Root--------------------------------------

    root:'./',

  //Node and bower----------------------------

    bowerPath: './bower_components/',
    nodePath: './node_modules',

  //Vendor paths------------------------------

    sourceVendor: './source/vendor/',
    publicVendor: './public/vendor/',

  //Browsersync-------------------------------

      browsers: ['chrome'],
      domain:'localhost/testtheme/',
      port:4000,
      syncFeatures: {
        clicks: true,
        forms: true,
        scroll: true,
        location: true
      },

  //Jade--------------------------------------

      jadeSrc: './source/jade/',
      jadeFolder: './source/jade',
      jadePath: './source/jade/**/*.jade',
      jadeDest: './',


  //PHP---------------------------------------

      phpPath: './**/*.php',

  //Sass and CSS-----------------------------

      sassPath: './source/scss/**/*.scss',
      sassFolder:'./source/scss/',
      cssPath: './public/css/',

  //Javascript------------------------------

      srcJsPath: './source/js/app.js',
      publicJsPath: './public/js/',
      publicJsCompPath: './public/js/',

  //Images--------------------------------

      srcImagePath: './source/images/*.{png,jpg,gif}',
      publicImagePath: './public/images/',

  //FTP----------------------------------

      ftpHost: 'your hostname/address',
      ftpUsername: 'your username',
      ftpPassword: 'your password',
      ftpRemoteFolder: 'your remote folder'

}

//------------------------------------------------------------------------------
//Gulp tasks. Create default task out of this json object
//------------------------------------------------------------------------------

var gulpTasks = {
  'tasks': [
    { 'name':'jade', 'run': gulpSettings.useJade },
    { 'name':'browser-sync', 'run': gulpSettings.runBrowserSync },
    { 'name':'ftp-upload', 'run': gulpSettings.ftpAutoUpload },
    { 'name':'sass', 'run':true },
    { 'name':'js', 'run':true },
    { 'name':'images', 'run':true },
    { 'name':'watch-dir', 'run':true }
  ]
}


//------------------------------------------------------------------------------
//REQUIRED MODULES
//------------------------------------------------------------------------------

var gulp  = require('gulp');
var browserSync = require('browser-sync');
var jade = require('gulp-jade-php');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var filter = require('gulp-filter');
var prompt = require('gulp-prompt');
var gulpif = require('gulp-if');
var rimraf = require('gulp-rimraf');
var newer = require('gulp-newer');
var gutil = require('gulp-util');
var sass  = require('gulp-sass');
var cssGlobbing = require('gulp-css-globbing');
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
var imagemin = require('gulp-imagemin');
var imageminJpegtran = require('imagemin-jpegtran');
var pngquant = require('imagemin-pngquant');
var imageminOptipng = require('imagemin-optipng');
var imageminGifsicle = require('imagemin-gifsicle');
var ftp = require('vinyl-ftp');
var path = require('path');
var runSequnce = require('run-sequence');


//Custom modules
var createTaskArray = require('./gulptasks/custom/create-task');
var getThemeName = require('./gulptasks/custom/get-theme-name');

//Getting path and foldername of theme.
//var theme_absolute_path = path.resolve(__dirname);
var theme_name =  getThemeName();

console.log(theme_name);


//------------------------------------------------------------------------------
//Browser Sync TASK
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
// TEMPLATE TASK to use Jade or Php
//------------------------------------------------------------------------------


gulp.task('use-jade', function() {
  return gulp.src( ['./*.php','!./functions.php'] )
    .pipe(prompt.confirm({
      message: 'Sure you want to use Jade? All php files will be deleted',
      default: true
    }))
    .pipe(rimraf())
    .pipe(notify({ message: 'Successfully changed mode. (Jade mode)', onLast: true}));
});

gulp.task('use-php', function() {
  return gulp.src( gulpSettings.jadeFolder )
    .pipe(prompt.confirm({
      message: 'Sure you want to use PHP? Jade folder will be deleted',
      default: true
    }))
    .pipe(rimraf())
    .pipe(notify({ message: 'Successfully changed mode. (PHP mode)', onLast: true}));
});


//------------------------------------------------------------------------------
// SASS TASK
//------------------------------------------------------------------------------

gulp.task('sass-build', function() {
  gulp.src( gulpSettings.sassPath )
  .pipe(cssGlobbing({
    extensions: ['.scss']
  }))
  .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
  .pipe(sass()).on('end', function(){ gutil.log(gutil.colors.magenta('Compiled sass'))})
  .pipe(autoprefixer({
      browsers: ['last 2 versions','> 5%'],
      cascade: false
  })).on('end', function(){ gutil.log(gutil.colors.magenta('Added browserprefixes to css'))})
  .pipe(gulp.dest(gulpSettings.cssPath)).on('end', function(){ gutil.log(gutil.colors.magenta('Successfully runned sass build'))});
});


//------------------------------------------------------------------------------
// JS TASKS
//------------------------------------------------------------------------------

gulp.task('js-build', function (){
  return browserify({entries: gulpSettings.srcJsPath, debug: true })
    .transform(babelify)
    .bundle().on('end', function(){ gutil.log(gutil.colors.magenta('Bundled js and converted es6 into es5'))})
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(source('app.js'))
    .pipe(gulp.dest( gulpSettings.publicJsPath )).on('end', function(){ gutil.log(gutil.colors.magenta('Successfully runned js build'))});
});


//------------------------------------------------------------------------------
//Build task
//------------------------------------------------------------------------------

gulp.task('build', function() {
  runSequnce(['sass-build', 'js-build'], consoleLogger);
});


var consoleLogger = function(msg) {
  if(!msg) {
    gutil.log(gutil.colors.magenta('Successfully builded public folders'));
  }
  else {
    gutil.log(gutil.colors.magenta(msg));
  }
}

//------------------------------------------------------------------------------
//CLEANUP TASK
//------------------------------------------------------------------------------

gulp.task('clean-prod', function() {
  return gulp.src(['./public/**/app.{css,js}', './**/.gitkeep'], {read: false})
  .pipe(rimraf({ force: true }))
  .pipe(notify({ message: 'Successfully cleaned up public folders. (Production mode)', onLast: true}));
});


//------------------------------------------------------------------------------
//FTP TASK
//------------------------------------------------------------------------------

var globals = [
    'source/**',
    'public/**',
    '*.php',
    '*.json',
    '*.css',
    '*.bower',
    '*.js',
    '*.md'
];

gulp.task('deploy-theme', function() {

  var connection = ftp.create({
    host: gulpSettings.ftpHost,
    user: gulpSettings.ftpUsername,
    password: gulpSettings.ftpPassword,
    paralell: 10,
    log: gutil.log
  });

  return gulp.src( globals, { base: '.', buffer: false })
    .pipe( connection.newer( gulpSettings.ftpRemoteFolder + '/wp-content/themes/' + theme_name ) )
    .pipe( connection.dest( gulpSettings.ftpRemoteFolder + '/wp-content/themes/' + theme_name ) )
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(notify({ message: 'Successfully deployed theme to remote server.', onLast: true}));

});

gulp.task('ftp-upload', function() {

  var connection = ftp.create({
    host: gulpSettings.ftpHost,
    user: gulpSettings.ftpUsername,
    password: gulpSettings.ftpPassword,
    paralell: 10,
    log: gutil.error
  });

  return gulp.src( globals, { base: '.', buffer: false })
    .pipe( connection.newer( gulpSettings.ftpRemoteFolder + '/wp-content/themes/' + theme_name ) )
    .pipe( connection.dest( gulpSettings.ftpRemoteFolder + '/wp-content/themes/' + theme_name ) )
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(notify({ message: 'Successfully uploaded file(s).', onLast: true}));

});

//------------------------------------------------------------------------------
//WATCH AND RUN TASKS
//------------------------------------------------------------------------------


gulp.task('jade', function(cb) {

  watch( gulpSettings.jadePath , function (cb) {

    return gulp.src( gulpSettings.jadePath )
      .pipe(jade({
        pretty: true
      }))
      .pipe(gulp.dest( gulpSettings.jadeDest ));

  });
});


gulp.task('js', function (cb){

  watch( gulpSettings.srcJsPath, function (cb) {

    return browserify({entries: gulpSettings.srcJsPath, debug: true })
      .transform(babelify)
      .bundle()
      .pipe(plumber())
      .pipe(source('app.js'))
      .pipe(gulpif( !gulpSettings.development, streamify(uglify())))
      .pipe(gulpif( !gulpSettings.development, rename({ suffix:'.min' })))
      .pipe(gulp.dest( gulpSettings.publicJsPath ));

  });

});

gulp.task('sass', function (cb) {

    watch( gulpSettings.sassPath, function (cb) {

        gulp.src( gulpSettings.sassPath )
          .pipe(plumber())
          .pipe(cssGlobbing({
              extensions: ['.scss']
          }))
          .pipe(sass())
          .pipe(autoprefixer({
              browsers: ['last 2 versions','> 5%'],
              cascade: false
          }))
          .pipe(gulpif( !gulpSettings.development , cssmin()))
          .pipe(gulpif( !gulpSettings.development, rename({ suffix:".min" })))
          .pipe(gulp.dest(gulpSettings.cssPath))
          .pipe(gulpif( gulpSettings.runBrowserSync ,  browserSync.stream()));

    });
});


//---------------------------------------------------------------------------------------------------------
// Image task. Runned when images are added or changed
//---------------------------------------------------------------------------------------------------------

gulp.task('images', function(cb) {
  watch( gulpSettings.srcImagePath , function (cb) {
    return gulp.src(gulpSettings.srcImagePath)
      .pipe(plumber())
      .pipe(newer(gulpSettings.publicImagePath))
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
       }))
      .pipe(imageminOptipng({optimizationLevel: 7})())
      .pipe(imageminGifsicle({interlaced: true})())
      .pipe(imageminJpegtran({ progressive: true })())
      .pipe(gulp.dest( gulpSettings.publicImagePath ))
      .pipe(notify({ 'title':'Image optimized','message': '<%= file.relative %>' }));
  });
});

//---------------------------------------------------------------------------------------------------------
// Watching task for all files
//---------------------------------------------------------------------------------------------------------


gulp.task('watch-dir', function () {

  watch( ['!./source/images/**/**','./source/**/**'] , gulpif(gulpSettings.useJade, ['jade','sass','js'], ['sass','js'] )).on('add', function (file) {

    var filepath = file;
    var filename = path.basename(filepath);

    return gulp.src( file, { read: false })
    .pipe(plumber())
    .pipe(notify({'title':'New file created','message': filename }));
  });

  //---------------------------------------------------------------------------------------------------------
  // Watching all files on change (Exluding images on change)
  //---------------------------------------------------------------------------------------------------------

  watch( ['!./source/images/**/**','./source/**/**'], gulpif(gulpSettings.useJade, ['jade','sass','js'], ['sass','js'] )).on('change', function (file) {

    var filepath = file;
    var filename = path.basename(filepath);

    return gulp.src( file, { read: false })
    .pipe(plumber())
    .pipe(notify({ 'title':'File changed','message': filename }));

  });


  //---------------------------------------------------------------------------------------------------------
  // Watching all images upon add in source/images folder
  //---------------------------------------------------------------------------------------------------------

  watch( './source/images/**/**', ['images'] ).on('add', function (file) {

      var filepath = file;
      var filename = path.basename(filepath);

      return gulp.src( file, { read: false })
      .pipe(plumber())
      .pipe(notify({ 'title':'New image added','message': filename }));

  });


  //---------------------------------------------------------------------------------------------------------
  // Watching all files on change and reload browsers(Browsersync feature)
  //---------------------------------------------------------------------------------------------------------

  watch( ['./source/**/**','./*.php'], gulpif(gulpSettings.useJade, ['jade','js','images'], ['js','images'])).on('change', browserSync.reload);

});


//------------------------------------------------------------------------------
//Foundation tasks
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
  return gulp.src(gulpSettings.bowerDir + 'foundation/js/**/**.*')
  .pipe(gulp.dest(gulpSettings.sourceVendor + 'foundation'));
});


//---------------------------------------------------------------------------------------------------------
// Run tasks
//---------------------------------------------------------------------------------------------------------

//Creating default run task
gulp.task('default', function() { createTaskArray(gulpTasks); });


//Task for deploying theme. Running first a cleanup in public folders before upload
//to remote server.
gulp.task('deploy', function() { runSequnce('clean-prod', ['deploy-theme']); });
