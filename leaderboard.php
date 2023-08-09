<?php
	require_once 'mysql-settings.php';
	$mysqli = new mysqli( MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DATABASE );
	if( $mysqli->connect_errno ) die( $mysqli->connect_error );
	
	$data = file_get_contents( 'php://input' );
	if( strlen( $data ) > 0 ) {
		$data = json_decode( $data, true );

		if( !( $stmt = $mysqli->prepare( 'insert into leaderboard( `name`, `score`, `lines`, `time` ) values ( ?, ?, ?, sec_to_time( ? ) )' ) ) ) {
			$mysqli->close();
			die( $mysqli->error );
		}

		if( !$stmt->bind_param( 'siii', $data[ 'name' ], $data[ 'score' ], $data[ 'lines' ], $data[ 'time' ] ) ) {
			$mysqli->close();
			die( $stmt->error );
		}
		
		if( !$stmt->execute() ) {
			$mysqli->close();
			die( $stmt->error );
		}
	}
	
	if( $result = $mysqli->query( 'select `name`, `score`, `lines`, time_to_sec( `time` ) `time` from leaderboard order by `score` desc, `time` asc, `lines` desc, `name` asc limit 10' ) ) {
		$arr = [];
		while( $obj = $result->fetch_object() ) { 
			$obj->score = intval( $obj->score );
			$obj->lines = intval( $obj->lines );
			$obj->time = intval( $obj->time );
			array_push( $arr, $obj );
		}
		$result->close();
		header( 'Content-Type: application/json' );
		echo json_encode( $arr );
	}
	$mysqli->close();
?>
