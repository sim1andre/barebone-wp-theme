#Barebone-wp-theme

This is a barebone wp theme with Gulp.

##Install

1. `git clone https://github.com/sim1andre/barebone-wp-theme.git`
2. `npm install`
3. `bower install`
4. `gulp`

Want to use Browsersync? See "How to set up Broewsersync" in this doc

--
--

##Modes

**Development**

This is the default mode that this theme uses. In this mode the css and js
is not getting minified.

**Production**

This is the mode that you will use when you are in a production envirement.
In this mode the css and js are beeing minified and the regular css and js is
removed from public folder.

**Remember!**
When you are going from dev to production you will need to change the functions.php
to use files with .min suffix.

**Change modes**

  1. Find and open gulpfile.js
  2. Go down to gulpSettings and find "development".

  `development:true/false;`



##How to set up Browsersync

  1. Go into gulpfile.js
  2. Find gulpSettings
  3. Go down to browsersync options
  4. Change this opions

    * runBrowserSync: true
    * browsers: ['Add browsers you want to test in']

      * Browsers to choose from:

        ````
        'chrome' This is default
        'explorer'
        'firefox'
        'opera'
        'safari'
        ````

    * domain: 'localhost/{"themename"}'

<br/>
<br/>
<br/>
<br/>


##Gulp features

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

<br/>
<br/>
<br/>
<br/>

##Use foundation

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
