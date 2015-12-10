<?php
    function styles() {
        wp_enqueue_style( 'app', get_template_directory_uri() . '/public/css/app.css' );
    }
    add_action('wp_enqueue_scripts', 'styles');
    function scripts() {
        wp_register_script( 'bundle', get_stylesheet_directory_uri() . '/public/js/app.js');
        wp_enqueue_script( 'bundle' );
    }
    add_action('get_header', 'remove_wpadminbar');

    function remove_wpadminbar() {
      remove_action('wp_head', '_admin_bar_bump_cb');
    }
    add_action( 'wp_enqueue_scripts', 'scripts' );
    function register_my_menus() {
      register_nav_menus(
        array(
          'new-menu' => __( 'New Menu' )
        )
      );
    }
    add_action( 'init', 'register_my_menus' );
?>
