import { Block } from './block';
import { Matrix2D } from './matrix2d';
import { Renderable } from './renderable';

export class Grid implements Matrix2D<Block>, Renderable {
	constructor( width: number, height: number ) {
		this._width = width;
		this._height = height;
		this._blocks = [];
		for( var y = 0; y < height; ++y ) this._blocks[ y ] = new Array( width );
	}

	public static forEach<T>( grid: Matrix2D<Block>, fn: ( x, y, b ) => T ): T {
		for( var y = 0; y < grid.height; ++y )
		for( var x = 0; x < grid.width; ++x ) {
			var retval = fn.call( this, x, y, grid.get( x, y ) );
			if( retval !== undefined ) return retval;
		}
	}

	public forEach<T>( fn: ( x, y, b ) => T ) {
		return Grid.forEach( this, fn );
	}

	private static boundsCheck( grid: Matrix2D<Block>, x: number, y: number ) {
		return x !== undefined && y !== undefined && isFinite( x ) && isFinite( y ) && x >= 0 && y >= 0 && x < grid.width && y < grid.height;
	}

	private boundsCheck( x: number, y: number ) {
		return Grid.boundsCheck( this, x, y );
	}

	public clearAll() {
		this.forEach( ( x, y ) => this.clear( x, y ) );
	}

	public clear( x: number, y: number ) {
		this.set( x, y, undefined );
	}

	public get( x: number, y: number ) {
		return this._blocks[ y ][ x ];
	}

	public set( x: number, y: number, value: Block );
	public set( x: number, y: number, value: Matrix2D<Block> );
	public set( x: number, y: number, value: any ) {
		if( value === undefined || value instanceof Block ) return this.setBlock( x, y, value );
		else return this.setGrid( x, y, value );
	}

	private setBlock( x: number, y: number, value: Block ) {
		this._blocks[ y ][ x ] = value;
	}

	private setGrid( x: number, y: number, value: Matrix2D<Block> ) {
		Grid.forEach( value, ( ix, iy, b ) => {
			var ox = x + ix,
				oy = y + iy;

			if( this.boundsCheck( ox, oy ) ) {
				this.set( ox, oy, b );
			}
		} );
	}

	public add( x: number, y: number, value: Matrix2D<Block> ) {
		Grid.forEach( value, ( ix, iy, b ) => {
			if( !b ) return;

			var ox = x + ix,
				oy = y + iy;

			if( this.boundsCheck( ox, oy ) ) {
				this.set( ox, oy, b );
			}
		} );
	}

	public isInBounds( x: number, y: number, grid?: Matrix2D<Block> ) {
		if( grid === undefined ) return this.boundsCheck( x, y );

		var ix = Infinity, iy = Infinity,
			gx = 0, gy = 0;
		Grid.forEach( grid, ( xx, yy, b ) => {
			if( !b ) return;
			ix = Math.min( ix, xx );
			iy = Math.min( iy, yy );
			gx = Math.max( gx, xx );
			gy = Math.max( gy, yy );
		} );

		return this.boundsCheck( x + ix, y + iy ) && this.boundsCheck( x + gx, y + gy );
	}

	public isHit( x: number, y: number, value: Matrix2D<Block> ) {
		return Grid.forEach( value, ( ox, oy, b ) => {
			var ix = ox + x,
				iy = oy + y;

			if( b && this.boundsCheck( ix, iy ) && this.get( ix, iy ) ) return true;
		} );
	}

	public static rotateLeft( old: Matrix2D<Block> ) {
		var width = old.height,
			height = old.width,
			retval = new Grid( width, height );
		retval.forEach( ( x, y ) => {
			retval.set( x, y, old.get( height - y - 1, x ) );
		} );
		return retval;
	}

	public rotateLeft() {
		return this.copy( Grid.rotateLeft( this ) );
	}

	public static rotateRight( old: Matrix2D<Block> ) {
		var width = old.height,
			height = old.width,
			retval = new Grid( width, height );
		retval.forEach( ( x, y ) => {
			retval.set( x, y, old.get( y, width - x - 1 ) );
		} );
		return retval;
	}

	public rotateRight() {
		return this.copy( Grid.rotateRight( this ) );
	}

	public static mirror( old: Matrix2D<Block> ) {
		var width = old.width,
			height = old.height,
			retval = new Grid( width, height );
		retval.forEach( ( x, y ) => {
			retval.set( x, y, old.get( width - x - 1, y ) );
		} );
		return retval;
	}

	public mirror() {
		return this.copy( Grid.mirror( this ) );
	}

	public static clone( grid: Matrix2D<Block> ) {
		var retval = new Grid( grid.width, grid.height );
		retval.copy( grid );
		return retval;
	}

	private clone() {
		return Grid.clone( this );
	}

	get width() { return this._width; }
	get height() { return this._height; }

	public copy( other: Matrix2D<Block> ) {
		this._width = other.width;
		this._blocks.length = this._height = other.height;
		for( var y = 0; y < this._height; ++y ) {
			if( !this._blocks[ y ] ) this._blocks[ y ] = [];
			this._blocks[ y ].length = this._width;
			for( var x = 0; x < this._width; ++x ) {
				this.set( x, y, other.get( x, y ) );
			}
		}
		return this;
	}

	private _width: number;
	private _height: number;
	private _blocks: Array<Array<Block>>;

	public render( c2d: CanvasRenderingContext2D ) {
		this.forEach( ( x, y, b ) => {
			if( !b ) return;
			c2d.save();
			c2d.translate( Block.width * x, Block.height * y );
			b.render( c2d );
			c2d.restore();
		} );
	}
}
