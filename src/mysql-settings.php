<?php
	if( count( get_included_files() ) === 1 ) exit( 1 );
	define( 'MYSQL_HOST', '{{ MYSQL_HOST }}' );
	define( 'MYSQL_USERNAME', '{{ MYSQL_USERNAME }}' );
	define( 'MYSQL_PASSWORD', '{{ MYSQL_PASSWORD }}' );
	define( 'MYSQL_DATABASE', '{{ MYSQL_DATABASE }}' );
?>
