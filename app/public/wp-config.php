<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'qG8g(`bz~cOFwJ)h6jk/Fe `:Rv61X]^4CUXYanYtb)>})UnaHoLhw=qwEy8)>D$' );
define( 'SECURE_AUTH_KEY',   'X9)}88l)o]~hd)%iaz?Z p]{Z13@O/{s2[Wj=WSbhjqT.B0?`*JeQx9YEXhnANAk' );
define( 'LOGGED_IN_KEY',     '7%59w&EKVOwrs>s?)IX./uNDqYAL6mV&y=(sDRHD3a?yf+X`Ilc8m G$H[bq[][Z' );
define( 'NONCE_KEY',         'q-BNp;|R;;]{TwW;VE2HwZ5t7Ts+RxQREeh~DJ:bG:;$fHyrYxqjm{[>)$|Y0mW$' );
define( 'AUTH_SALT',         '*ghOV1h!dxNnIx?89ooDL1a(glpE.&}((uDptTn+E$i{R_`$k^Bgr&;u{)(;|^.7' );
define( 'SECURE_AUTH_SALT',  '*Mc<(wjde8MOL xJfdp+t:^Fnp<+WdL0(KA-1<oblUJ7R![<9)N^:i*h7Uttj~%m' );
define( 'LOGGED_IN_SALT',    '$Fg0l|>lB:{Q}/r<WF=>GM4!|$6H3~@]=tE0//?ur2DTLaZhjyO?o_2WuMFpXdVK' );
define( 'NONCE_SALT',        'ceGWYe^?M $lt57Av.d 9Gl^_>+([NZ~/MW;Mr@V1~&J6|nF`cz_X~[XZcHu=p&j' );
define( 'WP_CACHE_KEY_SALT', '(*g?6cB%N]9O#q>mi]{a|kF6fy=v+Nh7hmD(Dr`]`Nm*,,`/FGXaw@-kf+1LEMT@' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
