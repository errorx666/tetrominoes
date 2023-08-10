import { Block } from '../block';
import { Game } from '../game';
import { LeaderboardEntry } from '../leaderboard-entry';
import { GameStateFalling } from './falling';
import { GameState } from './game-state';

export class GameStateLeaderboard implements GameState {
	constructor( game: Game, data?: LeaderboardEntry[] ) {
		this.#game = game;
		if( data ) {
			this.#data = [ ...data ];
		}
	}

	public start() {
		if( this.#data ) return;

		( async () => {
			try {
				const response = await fetch( 'leaderboard.php', {
					method: 'POST'
				} );
				if( !response.ok ) throw new Error( `Server returned ${response.status} ${response.statusText}` );
				this.#data = await response.json() as LeaderboardEntry[];
			} catch( ex ) {
				console.error( ex );
				this.#game.reset( GameStateFalling );
			}
		} )();
	}

	public input( e: KeyboardEvent ) {
		if( e.keyCode === 13 ) {
			this.#game.reset( GameStateFalling );
		}
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		c2d.font = '24pt sans-serif';
		c2d.fillText( 'Leaderboards', 0, 150 );

		c2d.font = '10pt sans-serif';
		c2d.fillStyle = '#000';

		if( this.#loading ) {
			c2d.fillText( 'Loading...', 0, 170 );
		} else {
			this.#data.forEach( ( data, index ) => {
				c2d.textAlign = 'left';
				c2d.fillText( data.name, 0, 170 + index * 20 );
				c2d.textAlign = 'right';
				c2d.fillText( String( data.score ), this.#game.board.width * Block.width, 170 + index * 20 );
			} );
		}

		c2d.restore();
	}

	#game: Game;
	#data: readonly LeaderboardEntry[];

	get #loading() { return this.#data === undefined; }
}
