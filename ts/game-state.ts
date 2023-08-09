import { Block } from './block';
import { Game } from './game';
import { Grid } from './grid';
import { StopWatch } from './stop-watch';
import { Tetromino } from './tetromino';
import { Timer } from './timer';

export class GameStateFalling implements GameState {
	constructor( game: Game ) {
		this._game = game;
	}

	private fallTimer() {
		this._frameTimer = new Timer( this.framesPerDrop * this._frameTime, () => this.fall() );
	}

	private lockTimer() {
		this._frameTimer = new Timer( this._framesBeforeLock * this._frameTime, () => this.fall() );
	}

	private _frameTimer: Timer;

	private _frameTime = 1000 / 60;
	private _framesBeforeLock = 15;

	private get framesPerDrop() {
		switch( this._game.level ) {
		case 0: return 48;
		case 1: return 43;
		case 2: return 38;
		case 3: return 33;
		case 4: return 28;
		case 5: return 23;
		case 6: return 18;
		case 7: return 13;
		case 8: return 8;
		case 9: return 6;
		case 10:
		case 11:
		case 12: return 5;
		case 13:
		case 14:
		case 15: return 4;
		case 16:
		case 17:
		case 18: return 3;
		case 19:
		case 20:
		case 21:
		case 22:
		case 23:
		case 24:
		case 25:
		case 26:
		case 27:
		case 28: return 2;
		default: return 1;
		}
	}

	public start() {
		this.tetromino = this._game.getPiece();
		this.tetromino.x = Math.floor( ( this._game.board.width - this.tetromino.width ) * .5 );
		this.tetromino.y = 0;
		if( this._game.board.isHit( this.tetromino.x, this.tetromino.y, this.tetromino ) ) {
			this._game.board.add( this.tetromino.x, this.tetromino.y, this.tetromino );
			this._game.setState( GameStateGameOver );
		}
		this.fallTimer();
	}

	public suspend() {
		this._frameTimer.pause();
	}

	public resume() {
		this._frameTimer.unpause();
	}

	public input( e: KeyboardEvent ) {
		var change = ( fn: ( o: { x: number; y: number; c: Grid } ) => void ) => {
			var o = {
				x: this.tetromino.x,
				y: this.tetromino.y,
				c: Grid.clone( this.tetromino )
			};

			fn( o );

			if( this._game.board.isInBounds( o.x, o.y, o.c ) && !this._game.board.isHit( o.x, o.y, o.c ) ) {
				this.tetromino.x = o.x;
				this.tetromino.y = o.y;
				this.tetromino.copy( o.c );
				return true;
			}
			return false;
		};

		var max = Math.max( this.tetromino.width, this.tetromino.height );

		function alt( i ) {
			return Math.ceil( i * .5 ) * ( ( i % 2 === 0 ) ? 1 : -1 );
		}

		switch( e.keyCode ) {
		case 13: // enter
		case 27: // esc
			this._game.pushState( GameStatePause );
			break;
		case 17: // ctrl
			for( var i = 0; i < max; ++i ) {
				if( change( o => ( o.c.rotateLeft(), o.x += alt( i ) ) ) ) break;
			}
			break;
		case 18: // alt
		case 32: // space
			for( var i = 0; i < max; ++i ) {
				if( change( o => ( o.c.rotateRight(), o.x += alt( i ) ) ) ) break;
			}
			break;
		case 87: // W
		case 38: // up
			while( change( o => ++o.y ) ) {
				++this._fallTimes;
			}
			this.lockTimer();
			break;
		case 65: // A
		case 37: // left
			change( o => --o.x );
			break;
		case 68: // D
		case 39: // right
			change( o => ++o.x );
			break;
		case 83: // S
		case 40: // down
			if( change( o => ++o.y ) ) {
				++this._fallTimes;
				this.fallTimer();
			} else {
				this.lockTimer();
			}
			break;
		default:
			break;
		}
	}

	private _fallTimes = 0;

	private fall() {
		var x = this.tetromino.x,
			y = this.tetromino.y + 1;
		if( !this._game.board.isInBounds( x, y, this.tetromino ) || this._game.board.isHit( x, y, this.tetromino ) ) {
			this.finishFall();
		} else {
			this.tetromino.y = y;
		}
	}

	private finishFall() {
		this._game.score += this._fallTimes;
		this._game.board.add( this.tetromino.x, this.tetromino.y, this.tetromino );
		this._game.setState( GameStateClearing );
	}

	public update() {
		this._frameTimer.check();
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();
		
		c2d.globalAlpha = .1;

		var y = 0;
		while( this._game.board.isInBounds( this.tetromino.x, this.tetromino.y + y + 1, this.tetromino ) && !this._game.board.isHit( this.tetromino.x, this.tetromino.y + y + 1, this.tetromino ) ) {
			++y;
		}

		c2d.translate( 0, y * Block.height );

		this.tetromino.render( c2d );

		c2d.restore();

		c2d.save();

		this._game.board.render( c2d );
		this.tetromino.render( c2d );

		c2d.restore();

		var nextPiece = this._game.peekPiece();
		c2d.translate( Block.width * ( this._game.board.width + 1 ), Block.height * 10 );
		nextPiece.render( c2d );
	}

	private _game: Game;
	public tetromino: Tetromino;
}

export class GameStateClearing implements GameState {
	constructor( game: Game ) {
		this._game = game;
	}

	public start() {
		this._lines = [];
		var lines: Array<number> = [];
		this._game.board.forEach( ( x, y, b ) => {
			if( b ) lines[ y ] = ( lines[ y ] || 0 ) + 1;
		} );
		lines.forEach( ( blocks, line ) => {
			if( blocks === this._game.board.width ) this._lines.push( line );
		} );
		this._lineCount = this._lines.length;
		if( this._lines.length === 0 ) this.done();
		this._stopWatch.start();
	}

	public suspend() {
		this._stopWatch.pause();
	}

	public resume() {
		this._stopWatch.unpause();
	}

	public update() {
		var e = this._stopWatch.elapsed,
			h = e / 10,
			p = Math.floor( e / 20 );

		this._lines.forEach( ( line, lineIndex ) => {
			var m: number;
			m = p - line - line;
			for( var i = 0; i < m; ++i ) {
				this._game.board.clear( i, line );
			}

			if( m > this._game.board.width ) {
				this._lines.splice( lineIndex, 1 );

				for( var y = line; y >= 0; --y )
				for( var x = 0; x < this._game.board.width; ++x ) {
					this._game.board.set( x, y, y === 0 ? undefined : this._game.board.get( x, y - 1 ) );
				}
				return;
			}

			m = Math.min( p - line, this._game.board.width );
			for( var i = 0; i < m; ++i ) {
				var b = this._game.board.get( i, line );
				if( b ) b.hue = ( h + line ) % 360;
			}
		} );

		if( this._lines.length === 0 ) this.done();
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();
		
		this._game.board.render( c2d );

		c2d.restore();
	}
	
	private done() {
		var multiplier: number;
		switch( this._lineCount ) {
		case 0: multiplier = 0;
			break;
		case 1: multiplier = 40;
			break;
		case 2: multiplier = 100;
			break;
		case 3: multiplier = 300;
			break;
		case 4: multiplier = 1200;
			break;
		default :
			throw new Error( 'Unpossible' );
		}

		this._game.score += multiplier * ( this._game.level + 1 );
		this._game.lines += this._lineCount;
		
		this._game.setState( GameStateFalling );
	}

	private _lines: Array<number>;
	private _lineCount: number;
	private _stopWatch = new StopWatch;
	private _game: Game;
}

export class GameStatePause implements GameState {
	constructor( game: Game ) {
		this._game = game;
	}

	public start() {
		this._game.playedTime.pause();
	}

	public stop() {
		this._game.playedTime.unpause();
	}

	public input( e: KeyboardEvent ) {
		if( e.keyCode === 13 ) this._game.popState();
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		this._game.board.render( c2d );
		c2d.font = '24pt sans-serif';
		c2d.fillText( 'Paused', 0, 150 );

		c2d.restore();
	}

	private _game: Game;
}

export class GameStateGameOver implements GameState {
	constructor( game: Game ) {
		this._game = game;
	}

	public start() {
		var time = this._game.playedTime.stop() / 1000;

		var name = prompt( 'Your score was ' + this._game.score + '.\r\nPlease enter your name for the leaderboard.' );

		if( name ) {
			try {
				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = e => {
					if( xhr.readyState !== 4 ) return;
					var data = undefined;
					if( String( xhr.status )[ 0 ] !== '2' ) {
						data = JSON.parse( xhr.responseText );
					}

					this._game.setState( GameStateLeaderboard, data );
				};
				xhr.open( 'POST', 'leaderboard.php', true );

				xhr.send( JSON.stringify( {
					name: name,
					score: this._game.score,
					lines: this._game.lines,
					time: time
				} ) );
			} catch( ex ) {}
		} else {
			this._game.setState( GameStateLeaderboard );
		}
	}

	public input( e: KeyboardEvent ) {
		if( e.keyCode === 13 ) {
			this._game.setState( GameStateLeaderboard );
		}
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		this._game.board.render( c2d );
		c2d.font = '24pt sans-serif';
		c2d.fillText( 'Game Over', 0, 150 );

		c2d.restore();
	}

	private _game: Game;
}

export class GameStateInstructions {
	constructor( game: Game ) {
		this._game = game;
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		c2d.font = '24pt sans-serif';
		c2d.fillText( 'Instructions', 0, 150 );

		var y = 170;
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
			var lineHeight = 20,
				marginBottom = 8,
				lines = 1;

			c2d.font = '12pt sans-serif';
			c2d.fillStyle = '#000';
			var left = String( s );
			if( Array.isArray( s ) ) {
				left = String( s[ 0 ] );
				var right = s[ 1 ];
				if( !Array.isArray( right ) ) right = [ right ];
				c2d.textAlign = 'right';
				(<Array<string>>right).forEach( ( s, i ) => {
					c2d.fillText( s, this._game.board.width * Block.width, y + ( i * lineHeight ) );
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
			this._game.setState( GameStateLeaderboard );
		}
	}

	private _game: Game;
}

export class GameStateLeaderboard implements GameState {
	constructor( game: Game, data?: Array<LeaderboardEntry> ) {
		this._game = game;
		if( data ) {
			this._data = [].slice.call( data, 0 );
		}
	}

	public start() {
		if( this._data ) return;

		try {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = e => {
				if( xhr.readyState !== 4 ) return;
				if( String( xhr.status )[ 0 ] === '2' ) this._data = <Array<LeaderboardEntry>>JSON.parse( xhr.responseText );
				else {
					this._game.reset( GameStateFalling );
				}
			};
			xhr.open( 'POST', 'leaderboard.php', true );
			xhr.send( null );
		} catch( ex ) {
			this._game.reset( GameStateFalling );
		}
	}

	public input( e: KeyboardEvent ) {
		if( e.keyCode === 13 ) {
			this._game.reset( GameStateFalling );
		}
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		c2d.font = '24pt sans-serif';
		c2d.fillText( 'Leaderboards', 0, 150 );

		c2d.font = '10pt sans-serif';
		c2d.fillStyle = '#000';

		if( this._loading ) {
			c2d.fillText( 'Loading...', 0, 170 );
		} else {
			this._data.forEach( ( data, index ) => {
				c2d.textAlign = 'left';
				c2d.fillText( data.name, 0, 170 + index * 20 );
				c2d.textAlign = 'right';
				c2d.fillText( String( data.score ), this._game.board.width * Block.width, 170 + index * 20 );
			} );
		}

		c2d.restore();
	}

	private _game: Game;
	private _data: Array<LeaderboardEntry>;

	private get _loading() { return this._data === undefined; }
}
