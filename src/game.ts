import { Block } from './block';
import { Board } from './board';
import { GameState, GameStateInstructions } from './game-state';
import { Renderable } from './renderable';
import { StopWatch } from './stop-watch';
import { Tetromino } from './tetromino';

export class Game implements Renderable {
	constructor() {
		this._state = [];
		this.board = new Board();
		this.reset( GameStateInstructions );
	}

	public reset( value: new( Game ) => GameState ) {
		this.board.clearAll();
		this.score = 0;
		this.lines = 0;
		this.playedTime = StopWatch.start();
		this._state.splice( 0, this._state.length );
		this._bag = undefined;
		this.setState( value );
	}

	public board;
	public score;
	public lines;

	public get level() {
		return Math.floor( this.lines / 10 );
	}

	private _state: Array<GameState>;

	public peekPiece() {
		return this.bag[ 0 ];
	}

	public getPiece() {
		return this.bag.shift();
	}

	private _bag: Array<Tetromino>;
	private get bag() {
		if( !this._bag || !this._bag.length ) {
			this._bag = Tetromino.randomBag();
		}
		return this._bag;
	}
	public playedTime: StopWatch;

	public get state() { return this._state[ this._state.length - 1 ]; }

	public setState( value: new( Game, any? ) => GameState, param? ) {
		var state = this._state.pop();
		var retval = undefined;
		if( state && state.stop ) retval = state.stop();
		if( value ) {
			var newState = new value( this, param );
			this._state.push( newState );
			if( newState.start ) newState.start( retval );
		}
	}

	public pushState( value: new( Game ) => GameState ) {
		var oldState = this.state;
		if( oldState && oldState.suspend ) oldState.suspend();
		if( value ) {
			var newState = new value( this );
			this._state.push( newState );
			if( newState.start ) newState.start();
		}
	}

	public popState() {
		var oldState = this._state.pop();
		var newState = this.state;

		var retval = undefined;
		if( oldState && oldState.stop ) retval = oldState.stop();
		if( newState && newState.resume ) newState.resume( retval );
		return oldState;
	}

	public input( e: KeyboardEvent ) {
		if( this.state.input ) this.state.input( e );
	}

	public update() {
		if( this.state.update ) this.state.update();
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		var sw = Math.min( Block.height, Block.width ) * .5,
			w = this.board.width * Block.width,
			h = ( this.board.height - 2 ) * Block.height,
			x1 = sw + .5,
			x2 = sw + w + x1,
			cx = ( x2 - x1 + 1 + Block.width ) * .5,
			y1 = sw + .5,
			y2 = sw + h + y1,
			cy = ( y2 - y1 + Block.height ) * .5,
			g = c2d.createRadialGradient( cx, cy, 0, cx, cy, Math.sqrt( w * w + h * h ) ),
			bg = c2d.createLinearGradient( x1, y1, x1, y2 ),
			e = this._stopWatch.elapsed,
			c = ( e * .0025 ) % 360;

		bg.addColorStop( 0, 'hsl(' + [ c, '30%', '80%' ].join( ',' ) + ')' );
		bg.addColorStop( 1, 'hsl(' + [ c, '10%', '80%' ].join( ',' ) + ')' );
		g.addColorStop( 0, 'hsl(' + [ c, '100%', '75%' ].join( ',' ) + ')' );
		g.addColorStop( 1, 'hsl(' + [ c, '100%', '50%' ].join( ',' ) + ')' );

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
		c2d.fillText( 'Score: ' + this.score, 0, 20 );

		c2d.textAlign = 'right';
		c2d.fillText( 'Lines: ' + this.lines, this.board.width * Block.width, 20 );
		c2d.restore();

		c2d.restore();
	}

	private _stopWatch = StopWatch.start();
}
