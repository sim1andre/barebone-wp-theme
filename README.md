#Barebone-wp-theme

This is a barebone wp theme with Gulp.

<br/>
<br/>
<br/>

#Theme documentation

1. [Getting started](#getting-started)
2. [Envirement modes](#modes)
3. [About Gulp features](#about-gulp-features)
4. [Browsersync](#browsersync)
5. [Cleanup](#cleanup)
5. [Foundation](#foundation)


<br/>
<br/>
<br/>


##Getting started

<br/>

1. Navigate to wp-content/themes folder inside terminal.
2. Run command below to clone repository into themes folder.
  * `git clone https://github.com/sim1andre/barebone-wp-theme.git "YOURTHEMENAME"`

2. Run this command to install all node dependencies
  * `npm install`

3. Run this command to install bower libraries.
  * `bower install`

4. Start gulp by running.
  * `gulp`


<br/>
<br/>
<br/>

##Envirement modes

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

**Remember! When you are going from development to production you will need to change the functions.php
to use files with .min suffix.**


<br/>
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

  * Deploy theme to remote server through ftp or sftp.

**Cleanup task**

  * Cleaning up public folders when changing between envirement modes

<br/>
<br/>
<br/>

##Browsersync

**Set domain to serve files from**

  1. Open gulpfile.js
  2. Find gulpSettings
  3. Go to browsersync option `domain`
  4. Set `"yourthemename"` to your theme folder name.

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

**Start Browsersync**

  1. Open gulpfile.js
  2. Find gulpSettings
  3. Go to browsersync options
  4. Set `runBrowserSync` to `true`
  5. If you already are running gulp, restart to get changes.


<br/>
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
