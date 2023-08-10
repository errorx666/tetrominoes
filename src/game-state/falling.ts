import { Game } from '../game';
import { GameStateGameOver } from './game-over';
import { Tetromino } from '../tetromino';
import { Timer } from '../timer';
import { GameState } from './game-state';
import { Grid } from '../grid';
import { GameStatePause } from './pause';
import { GameStateClearing } from './clearing';
import { Block } from '../block';

export class GameStateFalling implements GameState {
	constructor( game: Game ) {
		this.#game = game;
	}

	private fallTimer() {
		this.#frameTimer = new Timer( this.framesPerDrop * this.#frameTime, () => this.fall() );
	}

	private lockTimer() {
		this.#frameTimer = new Timer( this.#framesBeforeLock * this.#frameTime, () => this.fall() );
	}

	#frameTimer: Timer;
	#frameTime = 1000 / 60;
	#framesBeforeLock = 15;

	private get framesPerDrop() {
		switch( this.#game.level ) {
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
		this.tetromino = this.#game.getPiece();
		this.tetromino.x = Math.floor( ( this.#game.board.width - this.tetromino.width ) * .5 );
		this.tetromino.y = 0;
		if( this.#game.board.isHit( this.tetromino.x, this.tetromino.y, this.tetromino ) ) {
			this.#game.board.add( this.tetromino.x, this.tetromino.y, this.tetromino );
			this.#game.setState( GameStateGameOver );
		}
		this.fallTimer();
	}

	public suspend() {
		this.#frameTimer.pause();
	}

	public resume() {
		this.#frameTimer.unpause();
	}

	public input( e: KeyboardEvent ) {
		const change = ( fn: ( o: { x: number; y: number; c: Grid } ) => void ) => {
			const o = {
				x: this.tetromino.x,
				y: this.tetromino.y,
				c: Grid.clone( this.tetromino )
			};

			fn( o );

			if( this.#game.board.isInBounds( o.x, o.y, o.c ) && !this.#game.board.isHit( o.x, o.y, o.c ) ) {
				this.tetromino.x = o.x;
				this.tetromino.y = o.y;
				this.tetromino.copy( o.c );
				return true;
			}
			return false;
		};

		const max = Math.max( this.tetromino.width, this.tetromino.height );

		function alt( i ) {
			return Math.ceil( i * .5 ) * ( ( i % 2 === 0 ) ? 1 : -1 );
		}

		switch( e.keyCode ) {
		case 13: // enter
		case 27: // esc
			this.#game.pushState( GameStatePause );
			break;
		case 17: // ctrl
			for( let i = 0; i < max; ++i ) {
				if( change( o => ( o.c.rotateLeft(), o.x += alt( i ) ) ) ) break;
			}
			break;
		case 18: // alt
		case 32: // space
			for( let i = 0; i < max; ++i ) {
				if( change( o => ( o.c.rotateRight(), o.x += alt( i ) ) ) ) break;
			}
			break;
		case 87: // W
		case 38: // up
			while( change( o => ++o.y ) ) {
				++this.#fallTimes;
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
				++this.#fallTimes;
				this.fallTimer();
			} else {
				this.lockTimer();
			}
			break;
		default:
			break;
		}
	}

	#fallTimes = 0;

	private fall() {
		const x = this.tetromino.x;
		const y = this.tetromino.y + 1;
		if( !this.#game.board.isInBounds( x, y, this.tetromino ) || this.#game.board.isHit( x, y, this.tetromino ) ) {
			this.finishFall();
		} else {
			this.tetromino.y = y;
		}
	}

	private finishFall() {
		this.#game.score += this.#fallTimes;
		this.#game.board.add( this.tetromino.x, this.tetromino.y, this.tetromino );
		this.#game.setState( GameStateClearing );
	}

	public update() {
		this.#frameTimer.check();
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		c2d.globalAlpha = .1;

		let y = 0;
		while( this.#game.board.isInBounds( this.tetromino.x, this.tetromino.y + y + 1, this.tetromino ) && !this.#game.board.isHit( this.tetromino.x, this.tetromino.y + y + 1, this.tetromino ) ) {
			++y;
		}

		c2d.translate( 0, y * Block.height );

		this.tetromino.render( c2d );

		c2d.restore();

		c2d.save();

		this.#game.board.render( c2d );
		this.tetromino.render( c2d );

		c2d.restore();

		const nextPiece = this.#game.peekPiece();
		c2d.translate( Block.width * ( this.#game.board.width + 1 ), Block.height * 10 );
		nextPiece.render( c2d );
	}

	#game: Game;
	public tetromino: Tetromino;
}
