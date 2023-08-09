<?php
	if( count( get_included_files() ) === 1 ) exit( 1 );
	define( 'MYSQL_HOST', 'localhost' );
	define( 'MYSQL_USERNAME', 'tetro' );
	define( 'MYSQL_PASSWORD', 'hunter2' );
	define( 'MYSQL_DATABASE', 'tetrominoes' );
?>
