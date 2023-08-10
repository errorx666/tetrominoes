import { Block } from '../block';
import { Game } from '../game';
import { GameStateLeaderboard } from './leaderboard';

export class GameStateInstructions {
	constructor( game: Game ) {
		this.#game = game;
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		c2d.font = '24pt sans-serif';
		c2d.fillText( 'Instructions', 0, 150 );

		let y = 170;
		[
			[ 'Begin Game', 'Enter' ],
			[ 'Pause/Unpause', [ 'Enter', 'Esc' ] ],
			[ 'Drop', [ 'W', '↑' ] ],
			[ 'Left', [ 'A', '←' ] ],
			[ 'Fall', [ 'S', '↓' ] ],
			[ 'Right', [ 'D', '→' ] ],
			[ 'Rotate CW', [ 'Space', 'Alt' ] ],
			[ 'Rotate CCW', [ 'Ctrl' ] ]
		].forEach( ( s, i ) => {
			const lineHeight = 20;
			const marginBottom = 8;
			let lines = 1;

			c2d.font = '12pt sans-serif';
			c2d.fillStyle = '#000';
			let left = String( s );
			if( Array.isArray( s ) ) {
				left = String( s[ 0 ] );
				let right = s[ 1 ];
				if( !Array.isArray( right ) ) right = [ right ];
				c2d.textAlign = 'right';
				right.forEach( ( s, i ) => {
					c2d.fillText( s, this.#game.board.width * Block.width, y + ( i * lineHeight ) );
					++lines;
				} );
			}
			if( left ) {
				c2d.textAlign = 'left';
				c2d.fillText( left, 0, y );
			}
			y += lineHeight * ( lines - 1 ) + marginBottom;
		} );

		c2d.restore();
	}

	public input( e: KeyboardEvent ) {
		if( e.keyCode === 13 ) {
			this.#game.setState( GameStateLeaderboard );
		}
	}

	#game: Game;
}
