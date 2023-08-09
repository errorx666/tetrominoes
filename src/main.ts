import { Block } from './block';
import { Game } from './game';

( () => {
	var body = document.querySelector( 'body' ),
		canvas = document.createElement( 'canvas' ),
		audio = document.createElement( 'audio' ),
//			sourceOgg = document.createElement( 'source' ),
//			sourceMp3 = document.createElement( 'source' ),
		c2d = canvas.getContext( '2d' ),
		game = new Game;

	canvas.width = ( game.board.width + 6 ) * Block.width;
	canvas.height = game.board.height * Block.height;

/*
	audio.setAttribute( 'autoplay', 'autoplay' );
	audio.setAttribute( 'loop', 'loop' );
	sourceOgg.setAttribute( 'src', 'a.ogg' );
	sourceOgg.setAttribute( 'type', 'audio/ogg' );
	sourceMp3.setAttribute( 'src', 'a.mp3' );
	sourceMp3.setAttribute( 'type', 'audio/mpeg' );
	audio.appendChild( sourceOgg );
	audio.appendChild( sourceMp3 );
	body.appendChild( audio );
*/

	body.appendChild( canvas );

	var inputQueue: Array<KeyboardEvent> = [];
	window.onkeydown = ( e: KeyboardEvent ) => {
		inputQueue.push( e );
	};

	window.requestAnimationFrame( function frame() {
		c2d.clearRect( 0, 0, canvas.width, canvas.height );

		var e: KeyboardEvent;
		while( e = inputQueue.shift() ) {
			game.input( e );
		}
		game.update();
		game.render( c2d );

		window.requestAnimationFrame( frame );
	} );
} )();
