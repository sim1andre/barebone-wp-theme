'use strict'

//------------------------------------------------------------------------------
//GULP Settings
//------------------------------------------------------------------------------

var gulpSettings = {

    development: true,
    useJade: false,
    ftpAutoUpload: false,
    consoleMsg:false,

  //Root--------------------------------------

    root:'./',

  //Node and bower----------------------------

    bowerPath: './bower_components/',
    nodePath: './node_modules',

  //Vendor paths------------------------------

    sourceVendor: './source/vendor/',
    publicVendor: './public/vendor/',

  //Browsersync-------------------------------

      RunBrowserSync: true,
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


//Getting path and foldername of theme.
//Using theme_name in ftp upload.
var theme_absolute_path = path.resolve(__dirname);
var theme_name = path.basename(theme_absolute_path);


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
// TEMPLATE TASK
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
  .pipe(changed(gulpSettings.cssPath))
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
    .pipe(gulpif( !gulpSettings.development, streamify(uglify())))
    .pipe(gulp.dest( gulpSettings.publicJsPath ));
});


//------------------------------------------------------------------------------
//IMAGE TASK
//------------------------------------------------------------------------------

gulp.task('images-build', function() {
  return gulp.src(gulpSettings.srcImagePath)
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
     }))
    .pipe(imageminOptipng({optimizationLevel: 7})())
    .pipe(imageminGifsicle({interlaced: true})())
    .pipe(imageminJpegtran({ progressive: true })())
    .pipe(gulp.dest( gulpSettings.publicImagePath ));
});


gulp.task('build', function(callback) {
  runSequnce(['sass-build', 'js-build','images-build'], completedTask)
});

//After runned multiple tasks
var completedTask = function(callback) {
  gutil.log(gutil.colors.magenta('Build completed.'));
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

gulp.task('deploy', function() {
  runSequnce('clean-prod', ['deploy-theme']);
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
//FOUNDATION TASKS
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
          .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
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
          .pipe(gulpif( gulpSettings.RunBrowserSync ,  browserSync.stream()));
    });
});


gulp.task('check-files', function () {

  watch( './source/**/**' , ['jade','sass','js'] ).on('add', function (file) {

    var filepath = file;
    var filename = path.basename(filepath);
    var filetype = path.extname(filename).substr(1);

    return gulp.src( file, { read: false })
    .pipe(plumber())
    .pipe(notify({'title':'New file created','message': filename }));
  });
  watch( './source/**/**', ['jade','sass','js'] ).on('change', browserSync.reload);
  watch( './source/**/**', ['jade','sass','js'] ).on('change', function (file) {

    var filepath = file;
    var filename = path.basename(filepath);
    var filetype = path.extname(filename).substr(1);

    return gulp.src( file, { read: false })
    .pipe(plumber())
    .pipe(notify({ 'title':'File changed','message': filename }));
  });
});

gulp.task('sass-watch', ['jade','sass','js','browser-sync','check-files']);



gulp.task('watch', function() {
  gulp.watch( gulpSettings.sassPath , gulpif( gulpSettings.ftpAutoUpload, ['sass','ftp-upload'] , ['sass'])).on('change', browserSync.reload);
  gulp.watch( gulpSettings.srcJsPath , gulpif( gulpSettings.ftpAutoUpload, ['js', 'ftp-upload'] , ['js'] )).on('change', browserSync.reload);
  if(gulpSettings.useJade) {
    gulp.watch( gulpSettings.jadePath, gulpif( gulpSettings.ftpAutoUpload, ['jade', 'ftp-upload'], ['jade'] )).on('change', browserSync.reload);
  }
  gulp.watch( gulpSettings.phpPath, gulpif( gulpSettings.ftpAutoUpload, ['ftp-upload'] )).on('change', browserSync.reload);
  gulp.watch( gulpSettings.srcImagePath , gulpif ( gulpSettings.ftpAutoUpload, ['images', 'ftp-upload'] , ['images'])).on('change', browserSync.reload);
});

if(gulpSettings.useJade) {
  gulp.task('default' , gulpif(  gulpSettings.RunBrowserSync , ['jade','sass','js','browser-sync','images','watch'], ['jade','sass','js','images','watch'] ));
}
else {
  gulp.task('default' , gulpif(  gulpSettings.RunBrowserSync , ['sass','js','browser-sync','images','watch'], ['sass','js','images','watch'] ));
}
