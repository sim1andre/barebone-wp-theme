#Barebone-wp-theme

This is a barebone wp theme with advanced Gulp features.

**Some of the features:**

* Use Jade templates



<br/>
<br/>
<br/>

#Theme documentation

<br/>

1. [Getting started](#getting-started)
2. [Environment](#modes)
3. [Gulp features](#about-gulp-features)
4. [Browsersync](#browsersync)
5. [FTP](#ftp)
5. [Foundation](#foundation)


<br/>
<br/>


##Getting started

<br/>

1. Navigate to wp-content/themes folder inside terminal.
2. Run command below to clone repository into themes folder.
  * `git clone https://github.com/sim1andre/barebone-wp-theme.git "YOURTHEMENAME"`

2. Run `npm install` to install all node dependencies.

3. Run `bower install` to install bower libraries.

4. Choose php or jade files. Run `gulp use-php` or `gulp use-jade`

5. Start gulp by running `gulp`

<br/>
<br/>

##Environment modes

<br/>

**Development(Default)**

This is the default mode the theme uses. In this mode the css and js
is not getting minified.

**Production**

This is the mode that you will use when you are in a production envirement.
In this mode the css and js are beeing minified and the regular css and js is
removed from public folder.

<br/>

**Change modes**

  1. Find and open gulpfile.js
  2. Go down to gulpSettings and find "development".

  `development:true/false;`

  3. If you are already are running gulp. Restart it to get changes.

<br/>

###Remember!
**When you are going from development to production you will need to change the functions.php
to use files with .min suffix.**


<br/>
<br/>


##About Gulp features

<br/>

**SASS task**

  * Compiling sass into regular css.
  * Adding browser prefixes.
  * Minifying css and adding .min suffix to the filename.

**Javascript task**

  * Bundle up all your js files into one file.
  * Convert ES6 into ES5.
  * Minifiying js and adding a .min suffix to the filename.

**Image task**

  * Optimize images inside source image folder.
  * Removing already optimized images from source folder.

**BrowserSync task**

  * Injecting changes in css into browser(s).
  * Reload browsers when changes are detected in php and js files.
  * Syncing scroll, clicks etc.

**Deployment task**

  * Deploy theme to remote server through ftp.

**FTP task**

  * Uploading changed files to remote server.

**Cleanup task**

  * Automatically clean up public folders when deploying theme to remote server

<br/>
<br/>

##Browsersync

<br/>

**Set Browsersync to serve files from localhost**

  1. Open gulpfile.js
  2. Find gulpSettings
  3. Go to browsersync option `domain`
  4. Set `"yourwebfolder"`

<br/>

**Set Browsersync to serve files from remote server**

  1. Open gulpfile.js
  2. Find gulpSettings
  3. Go to browsersync option `domain`
  4. Replace `'localhost/yourwebfolder/'` with `http://www.yourdomain.no/`

<br/>

**Open more browsers automatically**

  1. Add more browsernames to `browsers: ['chrome']`

    * Browsers to choose from:

      ````
      'chrome'    //Google Chrome
      'explorer'  //Internet Explorer
      'firefox'   //Firefox
      'opera'     //Opera
      'safari'    //Apple safari
      ````

<br/>

**Enable Browsersync**

  1. Open gulpfile.js
  2. Find gulpSettings
  3. Go to browsersync options
  4. Set `runBrowserSync` to `true`
  5. If you already are running gulp, restart to get changes.


<br/>
<br/>

#FTP

<br/>

**Configure ftp for theme deployment**

  1. Open gulpfile.js
  2. Find gulpSettings
  3. Go to ftp options
  4. Insert your ftp credentials

  ````
  ftpHost: 'your hostname/adress',
  ftpUsername: 'your username',
  ftpPassword: 'your password',
  ftpRemoteFolder: 'your remote folder'
  ````

  5. Run `gulp deploy` to upload theme.


<br/>

**Enable auto upload on file change**

  1. Open gulpfile.js
  2. Find gulpSettings
  3. Go to ftp options
  5. Set `ftpAutoUpload` to `true`

<br/>
<br/>

##Foundation

1. Make sure you have installed bower.
2. Deside if you want sass or css version
    * Run `gulp foundation-sass` in your terminal if you want to use sass version.
        * To import sass version go to app.scss and insert this code

          ```SASS
          @import
          '../vendor/foundation/foundation',
          '../vendor/foundation/normalize';
          ```

    * Run `gulp foundation-css` in your terminal if you want to use css version.
       * Import css version the same way as above.

4. If you also want to use foundation js in this theme
    * Run `gulp foundation-js`
