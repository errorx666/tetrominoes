import { Block } from './block';
import { Board } from './board';
import { choose } from './choose';
import { GameState, GameStateInstructions } from './game-state';
import { Renderable } from './renderable';
import { StopWatch } from './stop-watch';
import { Tetromino, TetrominoI, TetrominoL, TetrominoLMirrored, TetrominoO, TetrominoS, TetrominoSMirrored, TetrominoT } from './tetromino';

export class Game implements Renderable {
	constructor() {
		this.#state = [];
		this.reset( GameStateInstructions );
	}

	public reset( value: new( Game ) => GameState ) {
		this.board.clearAll();
		this.score = 0;
		this.lines = 0;
		this.playedTime = StopWatch.start();
		this.#state.splice( 0, this.#state.length );
		this.#bag = [];
		this.setState( value );
	}

	public readonly board = new Board()
	public score: number;
	public lines: number;

	public get level() {
		return Math.floor( this.lines / 10 );
	}

	#state: GameState[];

	public peekPiece() {
		return this.bag[ 0 ];
	}

	public getPiece() {
		return this.bag.shift();
	}

	#bag = [] as Tetromino[];
	private get bag() {
		if( !this.#bag.length ) {
			this.#bag = Game.#randomBag();
		}
		return this.#bag;
	}

	static #randomBag() {
		const retval = [] as Tetromino[];
		const all = [ TetrominoS, TetrominoSMirrored, TetrominoI, TetrominoO, TetrominoT, TetrominoL, TetrominoLMirrored ] as (new ()=>Tetromino)[];
		while( all.length ) {
			const ctor = choose( all, true );
			retval.push( new ctor );
		}
		return retval;
	}

	public playedTime: StopWatch;

	public get state() { return this.#state[ this.#state.length - 1 ]; }

	public setState( value: new( Game, any? ) => GameState, param? ) {
		const state = this.#state.pop();
		state?.stop?.();
		if( value ) {
			const newState = new value( this, param );
			this.#state.push( newState );
			if( newState.start ) newState.start();
		}
	}

	public pushState( value: new( Game ) => GameState ) {
		const oldState = this.state;
		oldState.suspend?.();
		if( value ) {
			const newState = new value( this );
			this.#state.push( newState );
			if( newState.start ) newState.start();
		}
	}

	public popState() {
		const oldState = this.#state.pop();
		const newState = this.state;
		oldState.stop?.();
		newState.resume?.();
		return oldState;
	}

	public input( e: KeyboardEvent ) {
		this.state.input?.( e );
	}

	public update() {
		this.state.update?.();
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		const sw = Math.min( Block.height, Block.width ) * .5;
		const w = this.board.width * Block.width;
		const h = ( this.board.height - 2 ) * Block.height;
		const x1 = sw + .5;
		const x2 = sw + w + x1;
		const cx = ( x2 - x1 + 1 + Block.width ) * .5;
		const y1 = sw + .5;
		const y2 = sw + h + y1;
		const cy = ( y2 - y1 + Block.height ) * .5;
		const g = c2d.createRadialGradient( cx, cy, 0, cx, cy, Math.sqrt( w * w + h * h ) );
		const bg = c2d.createLinearGradient( x1, y1, x1, y2 );
		const e = this.#stopWatch.elapsed;
		const c = ( e * .0025 ) % 360;

		bg.addColorStop( 0, `hsl(${[ c, '30%', '80%' ].join( ',' )})` );
		bg.addColorStop( 1, `hsl(${[ c, '10%', '80%' ].join( ',' )})` );
		g.addColorStop( 0, `hsl(${[ c, '100%', '75%' ].join( ',' )})` );
		g.addColorStop( 1, `hsl(${[ c, '100%', '50%' ].join( ',' )})` );

		c2d.save();
		c2d.fillStyle = bg;
		c2d.fillRect( x1, y1, x2, y2 );
		c2d.restore();

		c2d.save();
		c2d.translate( Block.width, Block.height );
		c2d.translate( 0, -2 * Block.height );
		this.state.render( c2d );
		c2d.restore();

		c2d.save();
		c2d.lineWidth = sw;
		c2d.strokeStyle = g;
		c2d.strokeRect( x1, y1, x2, y2 );
		c2d.restore();

		c2d.save();
		c2d.translate( Block.width, Block.height );
		c2d.font = '12pt sans-serif';
		c2d.fillStyle = '#000';

		c2d.textAlign = 'left';
		c2d.fillText( `Score: ${this.score}`, 0, 20 );

		c2d.textAlign = 'right';
		c2d.fillText( `Lines: ${this.lines}`, this.board.width * Block.width, 20 );
		c2d.restore();

		c2d.restore();
	}

	#stopWatch = StopWatch.start();
}
