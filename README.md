##Barebone-wp-theme

This is a barebone wp theme with Gulp.


####Install
1. `git clone https://github.com/sim1andre/barebone-wp-theme.git`
2. `npm install`
3. `bower install`
4. `gulp`


####Gulp features

* Gulp

    **SASS task**
    * Compiling sass into regular css.
    * Adding browser prefixes.
    * Minifying css and adding .min suffix to the filename.

    **Javascript task**
    * Bundle up all your js files into one file.
    * Convert ES6 into ES5.
    * Minifiying js and adding a .min suffix to the filename.



####Use foundation in this theme
1. Make sure you have installed bower.
2. Deside if you want sass or css version
    * Run `gulp foundation-sass` in your terminal if you want to use sass version.
        * To import sass version go to app.scss and insert this code

          ```
          @import
          '../vendor/foundation/foundation',
          '../vendor/foundation/normalize';
          ```

    * Run `gulp foundation-css` in your terminal if you want to use css version.
       * Import css version the same way as above.

4. If you also want to use foundation js in this theme
    * Run `gulp foundation-js`
