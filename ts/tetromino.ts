import { Block } from './block';
import { Board } from './board';
import { GameStateInstructions } from './game-state';
import { Grid } from './grid';
import { StopWatch } from './stop-watch';

function choose<T>( choices: Array<T>, remove = false ): T {
	var i = Math.floor( Math.random() * choices.length ),
		retval = choices[ i ];
	if( remove ) choices.splice( i, 1 );
	return retval;
}

export class Tetromino extends Grid implements Renderable {
	constructor( width: number, height: number, hue: number ) {
		super( width, height );
		this._hue = hue;
	}

	public get hue() {
		return this._hue;
	}

	public set hue( value: number ) {
		this._hue = value;
		this.forEach( ( x, y, b ) => b.hue = this._hue );
	}
	
	private _hue: number;
	public grid: Grid;
	public x: number;
	public y: number;

	public addBlock( x: number, y: number ) {
		this.set( x, y, new Block( this._hue ) );
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();
		
		c2d.translate( Block.width * ( this.x || 0 ), Block.height * ( this.y || 0 ) );
		super.render( c2d );
		c2d.restore();
	}

	private static get _allTetrominoes() {
		return [ TetrominoS, TetrominoSMirrored, TetrominoI, TetrominoO, TetrominoT, TetrominoL, TetrominoLMirrored ];
	}

	public static random() {
		var ctor = choose<new()=>Tetromino>( Tetromino._allTetrominoes );
		return new ctor;
	}

	public static randomBag() {
		var retval: Array<Tetromino> = [],
			all = Tetromino._allTetrominoes.slice( 0 );
		while( all.length ) {
			var ctor = choose<new()=>Tetromino>( all, true );
			retval.push( new ctor );
		}
		return retval;
	}
}

class TetrominoS extends Tetromino {
	constructor( hue: number = 120 ) {
		super( 3, 3, hue );
		this.addBlock( 1, 0 );
		this.addBlock( 2, 0 );
		this.addBlock( 0, 1 );
		this.addBlock( 1, 1 );
	}
}

class TetrominoSMirrored extends TetrominoS {
	constructor( hue: number = 0 ) {
		super( hue );

		this.mirror();
	}
}

class TetrominoI extends Tetromino {
	constructor( hue: number = 180 ) {
		super( 2, 4, hue );
		this.addBlock( 0, 0 );
		this.addBlock( 0, 1 );
		this.addBlock( 0, 2 );
		this.addBlock( 0, 3 );
	}
}

class TetrominoO extends Tetromino {
	constructor( hue: number = 60 ) {
		super( 2, 2, hue );
		this.addBlock( 0, 0 );
		this.addBlock( 0, 1 );
		this.addBlock( 1, 0 );
		this.addBlock( 1, 1 );
	}
}

class TetrominoT extends Tetromino {
	constructor( hue: number = 300 ) {
		super( 3, 3, hue );
		this.addBlock( 0, 0 );
		this.addBlock( 1, 0 );
		this.addBlock( 2, 0 );
		this.addBlock( 1, 1 );
	}
}

class TetrominoL extends Tetromino {
	constructor( hue: number = 35 ) {
		super( 3, 3, hue );
		this.addBlock( 0, 0 );
		this.addBlock( 0, 1 );
		this.addBlock( 0, 2 );
		this.addBlock( 1, 2 );
	}
}

class TetrominoLMirrored extends TetrominoL {
	constructor( hue: number = 240 ) {
		super( hue );
		
		this.mirror();
	}
}
