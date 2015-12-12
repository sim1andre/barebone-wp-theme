<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  	<meta charset="<?php bloginfo( 'charset' ); ?>" />
  	<meta name="viewport" content="width=device-width" />
  	<title><?php wp_title( ' | ', true, 'right' ); ?></title>
    <link rel="shortcut icon" href="<?php bloginfo('siteurl'); ?>/favicon.png"/>
  	<?php wp_head(); ?>
</head>
<body  <?php body_class(); ?>>
