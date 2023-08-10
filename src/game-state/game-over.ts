import { Game } from '../game';
import { GameState } from './game-state';
import { GameStateLeaderboard } from './leaderboard';

export class GameStateGameOver implements GameState {
	constructor( game: Game ) {
		this.#game = game;
	}

	public start() {
		const time = this.#game.playedTime.stop() / 1000;
		const name = prompt( `Your score was ${this.#game.score}.\r\nPlease enter your name for the leaderboard.` );
		if( name ) {
			( async () => {
				try {
					const response = await fetch( 'leaderboard.php', {
						method: 'POST',
						body: JSON.stringify( {
							name: name,
							score: this.#game.score,
							lines: this.#game.lines,
							time: time
						} ),
						headers: [ [ 'Content-Type', 'application/json' ] ]
					} );
					if( !response.ok ) throw new Error( `Server returned ${response.status} ${response.statusText}` );
					this.#game.setState( GameStateLeaderboard, await response.json() );
				} catch( ex ) {
					console.error( ex );
					this.#game.setState( GameStateLeaderboard );
				}

			} )();
		} else {
			this.#game.setState( GameStateLeaderboard );
		}
	}

	public input( e: KeyboardEvent ) {
		if( e.keyCode === 13 ) {
			this.#game.setState( GameStateLeaderboard );
		}
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		this.#game.board.render( c2d );
		c2d.font = '24pt sans-serif';
		c2d.fillText( 'Game Over', 0, 150 );

		c2d.restore();
	}

	#game: Game;
}
