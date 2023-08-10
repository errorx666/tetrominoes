import { Block } from './block';
import { Matrix2D } from './matrix2d';
import { Renderable } from './renderable';

export class Grid implements Matrix2D<Block>, Renderable {
	constructor( width: number, height: number ) {
		this.#width = width;
		this.#height = height;
		this.#blocks = [];
		for( let y = 0; y < height; ++y ) this.#blocks[ y ] = new Array( width );
	}

	public static forEach<T>( grid: Matrix2D<Block>, fn: ( x, y, b ) => T ): T {
		for( let y = 0; y < grid.height; ++y )
		for( let x = 0; x < grid.width; ++x ) {
			const retval = fn.call( this, x, y, grid.get( x, y ) );
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
		const row = this.#blocks[ y ];
		return row ? row[ x ] : undefined;
	}

	public set( x: number, y: number, value: Block ){
		const row = this.#blocks[ y ];
		if( row ) row[ x ] = value;
	}

	public add( x: number, y: number, value: Matrix2D<Block> ) {
		Grid.forEach( value, ( ix, iy, b ) => {
			if( !b ) return;

			const ox = x + ix;
			const oy = y + iy;

			if( this.boundsCheck( ox, oy ) ) {
				this.set( ox, oy, b );
			}
		} );
	}

	public isInBounds( x: number, y: number, grid?: Matrix2D<Block> ) {
		if( grid === undefined ) return this.boundsCheck( x, y );

		let ix = Infinity;
		let iy = Infinity;
		let gx = 0;
		let gy = 0;
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
			const ix = ox + x;
			const iy = oy + y;
			if( b && this.boundsCheck( ix, iy ) && this.get( ix, iy ) ) return true;
		} );
	}

	public static rotateLeft( old: Matrix2D<Block> ) {
		const { width, height } = old;
		const retval = new Grid( height, width );
		retval.forEach( ( x, y ) => {
			retval.set( x, y, old.get( width - y - 1, x ) );
		} );
		return retval;
	}

	public rotateLeft() {
		return this.copy( Grid.rotateLeft( this ) );
	}

	public static rotateRight( old: Matrix2D<Block> ) {
		const { width, height } = old;
		const retval = new Grid( height, width );
		retval.forEach( ( x, y ) => {
			retval.set( x, y, old.get( y, height - x - 1 ) );
		} );
		return retval;
	}

	public rotateRight() {
		return this.copy( Grid.rotateRight( this ) );
	}

	public static mirror( old: Matrix2D<Block> ) {
		const { width, height } = old;
		const retval = new Grid( width, height );
		retval.forEach( ( x, y ) => {
			retval.set( x, y, old.get( width - x - 1, y ) );
		} );
		return retval;
	}

	public mirror() {
		return this.copy( Grid.mirror( this ) );
	}

	public static clone( grid: Matrix2D<Block> ) {
		const retval = new Grid( grid.width, grid.height );
		retval.copy( grid );
		return retval;
	}

	get width() { return this.#width; }
	get height() { return this.#height; }

	public copy( other: Matrix2D<Block> ) {
		this.#width = other.width;
		this.#blocks.length = this.#height = other.height;
		for( let y = 0; y < this.#height; ++y ) {
			if( !this.#blocks[ y ] ) this.#blocks[ y ] = [];
			this.#blocks[ y ].length = this.#width;
			for( let x = 0; x < this.#width; ++x ) {
				this.set( x, y, other.get( x, y ) );
			}
		}
		return this;
	}

	#width: number;
	#height: number;
	#blocks: Block[][];

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
