##Barebone-wp-theme

This is a barebone wp theme with many features.


####Install
1. `git clone https://github.com/sim1andre/barebone-wp-theme.git`
2. `npm install`
3. `bower install`
4. `gulp`

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
