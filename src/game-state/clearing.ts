import { Game } from '../game';
import { StopWatch } from '../stop-watch';
import { GameStateFalling } from './falling';
import { GameState } from './game-state';

export class GameStateClearing implements GameState {
	constructor( game: Game ) {
		this.#game = game;
	}

	public start() {
		this.#lines = [];
		const lines = [] as number[];
		this.#game.board.forEach( ( x, y, b ) => {
			if( b ) lines[ y ] = ( lines[ y ] ?? 0 ) + 1;
		} );
		lines.forEach( ( blocks, line ) => {
			if( blocks === this.#game.board.width ) this.#lines.push( line );
		} );
		this.#lineCount = this.#lines.length;
		if( this.#lines.length === 0 ) this.done();
		this.#stopWatch.start();
	}

	public suspend() {
		this.#stopWatch.pause();
	}

	public resume() {
		this.#stopWatch.unpause();
	}

	public update() {
		const e = this.#stopWatch.elapsed;
		const h = e / 10;
		const p = Math.floor( e / 20 );
		this.#lines.forEach( ( line, lineIndex ) => {
			let m: number;
			m = p - line - line;
			for( let i = 0; i < m; ++i ) {
				this.#game.board.clear( i, line );
			}

			if( m > this.#game.board.width ) {
				this.#lines.splice( lineIndex, 1 );

				for( let y = line; y >= 0; --y )
				for( let x = 0; x < this.#game.board.width; ++x ) {
					this.#game.board.set( x, y, y === 0 ? undefined : this.#game.board.get( x, y - 1 ) );
				}
				return;
			}

			m = Math.min( p - line, this.#game.board.width );
			for( let i = 0; i < m; ++i ) {
				const b = this.#game.board.get( i, line );
				if( b ) b.hue = ( h + line ) % 360;
			}
		} );

		if( this.#lines.length === 0 ) this.done();
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		this.#game.board.render( c2d );

		c2d.restore();
	}

	private done() {
		const multiplier = ( () => {
			switch( this.#lineCount ) {
			case 0: return 0;
			case 1: return 40;
			case 2: return 100;
			case 3: return 300;
			case 4: return 1200;
			default: throw new Error( 'Unpossible' );
			}
		} )();

		this.#game.score += multiplier * ( this.#game.level + 1 );
		this.#game.lines += this.#lineCount;

		this.#game.setState( GameStateFalling );
	}

	#lines: number[];
	#lineCount: number;
	readonly #stopWatch = new StopWatch;
	#game: Game;
}
