import { Block } from './block';
import { Game } from './game';

( () => {
	const body = document.querySelector( 'body' );
	const canvas = document.createElement( 'canvas' );
//	const audio = document.createElement( 'audio' );
//			sourceOgg = document.createElement( 'source' ),
//			sourceMp3 = document.createElement( 'source' ),
	const c2d = canvas.getContext( '2d' );
	const game = new Game;

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

	const inputQueue = [] as KeyboardEvent[];
	window.onkeydown = ( e: KeyboardEvent ) => {
		inputQueue.push( e );
	};

	window.requestAnimationFrame( function frame() {
		c2d.clearRect( 0, 0, canvas.width, canvas.height );

		let e: KeyboardEvent;
		while( e = inputQueue.shift() ) {
			game.input( e );
		}
		game.update();
		game.render( c2d );

		window.requestAnimationFrame( frame );
	} );
} )();
