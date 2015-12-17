'use strict'

//------------------------------------------------------------------------------
//GULP Settings
//------------------------------------------------------------------------------

//Set to true if you are in a production environment.
//True state will minify css and js.
var production = false;

//Set to true if you will use Browsersync.
//Remember to configure Browsersync first.
var useBrowserSync = false;

//Use Jade Templates by setting this to true.
var useJadeTemplate = false;

//Set to true if you want to upload files to remote server on file change.
var ftpAutoUpload = false;

//Set to true if you want screen notifications. Else notifications will show
//up in terminal.
var desktopNotifications = false;

var notifications = {
  onNewImages:true,
  onFileChange:true,
  onNewFile:true,
  onFtpUploud:true
}

var gulpSettings = {

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
    { 'name':'jade', 'run': useJadeTemplate , 'useInBS':true },
    { 'name':'browser-sync', 'run': useBrowserSync },
    { 'name':'ftp-upload', 'run': ftpAutoUpload , 'useInBS':true },
    { 'name':'sass', 'run':true },
    { 'name':'js', 'run':true , 'useInBS':true  },
    { 'name':'images', 'run':true , 'useInBS':true  },
    { 'name':'watch-dir', 'run':true }
  ]
}


//------------------------------------------------------------------------------
//REQUIRED MODULES
//------------------------------------------------------------------------------

var gulp  = require('gulp');
var plugins = require('gulp-load-plugins')({ pattern: '*' });
var argv = require('minimist');
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
var notifier = require('node-notifier');
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
var getIcon = path.resolve('gulptasks/icons/wordpress-logo.png');
var themeName = getThemeName();

//------------------------------------------------------------------------------
//Browser Sync TASK
//------------------------------------------------------------------------------

gulp.task('browser-sync', function() { //Works with gulp-load-plugins

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
// Template task to use Jade
//------------------------------------------------------------------------------


gulp.task('cleanup-php', function() {
  return gulp.src( ['./*.php','!./functions.php'] )
    .pipe(prompt.confirm({
      message: 'Sure you want to use Jade? All php files will be deleted before compiling Jade',
      default: true
    }))
    .pipe(rimraf())
});

gulp.task('build-jade', function() {
  return gulp.src( gulpSettings.jadePath )
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest( gulpSettings.jadeDest ));
});

gulp.task('use-jade', function() {
  runSequnce(['cleanup-php'], 'build-jade', function() {
    if(desktopNotifications) {
      notifier.notify({title: 'Now using Jade', icon: getIcon, message: 'Changed to Jade mode', sound: true});
    }
    else {
      gutil.log(gutil.colors.magenta('Successfully changed to Jade mode'));
    }
  });
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
  .pipe(sass())
  .pipe(autoprefixer({
      browsers: ['last 2 versions','> 5%'],
      cascade: false
  }))
  .pipe(gulp.dest(gulpSettings.cssPath));
});


//------------------------------------------------------------------------------
// JS TASKS
//------------------------------------------------------------------------------

gulp.task('js-build', function (){
  return browserify({entries: gulpSettings.srcJsPath, debug: true })
    .transform(babelify)
    .bundle()
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(source('app.js'))
    .pipe(gulp.dest( gulpSettings.publicJsPath ));
  });


//------------------------------------------------------------------------------
//Build task
//------------------------------------------------------------------------------

gulp.task('build', function () {
  runSequnce(['sass-build'], 'js-build', function () {
    if(desktopNotifications) {
      notifier.notify({title: 'Build Task', icon: getIcon, message: 'Successfully built public folders', sound: true});
    }
    else {
      gutil.log(gutil.colors.magenta('Successfully built public folders'));
    }
  });
});



//------------------------------------------------------------------------------
//DEPLOY TASK
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

gulp.task('clean-prod', function() {
  return gulp.src(['./public/**/app.{css,js}', './**/.gitkeep'], {read: false})
  .pipe(rimraf({ force: true }));
});


gulp.task('deploy-theme', function() {

  var connection = ftp.create({
    host: gulpSettings.ftpHost,
    user: gulpSettings.ftpUsername,
    password: gulpSettings.ftpPassword,
    paralell: 10,
    log: gutil.log
  });

  return gulp.src( globals, { base: '.', buffer: false })
    .pipe( connection.newer( gulpSettings.ftpRemoteFolder + '/wp-content/themes/' + themeName ) )
    .pipe( connection.dest( gulpSettings.ftpRemoteFolder + '/wp-content/themes/' + themeName ) )
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}));

});

gulp.task('ftp-upload', function(cb) {

  var connection = ftp.create({
    host: gulpSettings.ftpHost,
    user: gulpSettings.ftpUsername,
    password: gulpSettings.ftpPassword,
    paralell: 10,
    log: gutil.error
  });


  watch( globals , function(cb) {

    return gulp.src( globals, { base: '.', buffer: false })
      .pipe( connection.newer( gulpSettings.ftpRemoteFolder + '/wp-content/themes/' + themeName ) )
      .pipe( connection.dest( gulpSettings.ftpRemoteFolder + '/wp-content/themes/' + themeName ) )
      .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
      .pipe(gulpif(desktopNotifications && notifications.onFtpUpload, notify({'title':'FTP', icon: getIcon, 'message': 'File uploaded'})))
  });
});

//Task for deploying theme. Running first a cleanup in public folders before upload
//to remote server.
gulp.task('deploy', function() {
  runSequnce(['clean-prod'], 'deploy-theme', function () {
    if(desktopNotifications) {
      notifier.notify({title: 'FTP task', icon: getIcon, message: 'Successfully deployed theme'});
    }
    else {
      gutil.log(gutil.colors.magenta('Successfully deployed theme'));
    }
  });
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
      .pipe(gulpif( production , streamify(uglify())))
      .pipe(gulpif( production , rename({ suffix:'.min' })))
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
          .pipe(gulpif( production , cssmin()))
          .pipe(gulpif( production , rename({ suffix:".min" })))
          .pipe(gulp.dest(gulpSettings.cssPath))
          .pipe(gulpif( useBrowserSync ,  browserSync.stream()));
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
      .pipe(gulpif( desktopNotifications , notify({'title':'Image minified', icon: getIcon, 'message': '<%= file.relative %>'})));
  });
});

//---------------------------------------------------------------------------------------------------------
// Watching task for all files
//---------------------------------------------------------------------------------------------------------

var eventLogger = function(msg) {
  gutil.log(gutil.colors.magenta(msg));
}


gulp.task('watch-dir', function () {

  watch( ['!./source/images/**/**','./source/**/**'] , gulpif( useJadeTemplate, ['jade','sass','js'], ['sass','js'] )).on('add', function (file) {

    var filepath = file;
    var filename = path.basename(filepath);

    return gulp.src( file, { read: false })
    .pipe(plumber()).on('end', function() {
      if(!desktopNotifications && notifications.onNewFile) {
        eventLogger('New file created/added: ' + filename)
      }})
    .pipe(gulpif(desktopNotifications && notifications.onNewFile, notify({title: 'New file created/added', icon: getIcon, message: filename})));

  });

  //---------------------------------------------------------------------------------------------------------
  // Watching all files on change (Exluding images on change)
  //---------------------------------------------------------------------------------------------------------

  watch( ['!./source/images/**/**','./source/**/**'], gulpif( useJadeTemplate, ['jade','sass','js'], ['sass','js'] )).on('change', function (file) {

    var filepath = file;
    var filename = path.basename(filepath);

    return gulp.src( file, { read: false })
    .pipe(plumber()).on('end', function() {
      if(!desktopNotifications && notifications.onFileChange) {
        eventLogger('File changed: ' + filename)
      }})
    .pipe(gulpif(desktopNotifications && notifications.onFileChange, notify({title: 'File changed', icon: getIcon, message: filename})));
  });


  //---------------------------------------------------------------------------------------------------------
  // Watching all images upon add in source/images folder
  //---------------------------------------------------------------------------------------------------------

  watch( './source/images/**/**', ['images'] ).on('add', function (file) {

      var filepath = file;
      var filename = path.basename(filepath);

      return gulp.src( file, { read: false })
      .pipe(plumber()).on('end', function() {
        if(!desktopNotifications && notifications.onNewImage) {
          eventLogger('New image added: ' + filename)
        }})
      .pipe(gulpif(desktopNotifications && notifications.onNewImage, notify({title: 'New image added: ', icon: getIcon, message: filename})));

  });


  //---------------------------------------------------------------------------------------------------------
  // Watching all files on change and reload browsers(Browsersync feature)
  //---------------------------------------------------------------------------------------------------------

  watch( ['./source/**/**','./*.php'], gulpif( useJadeTemplate , ['jade','js','images','ftp-upload'], ['js','images','ftp-upload']) ).on('change', browserSync.reload);

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
