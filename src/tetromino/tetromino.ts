import { Block } from '../block';
import { Grid } from '../grid';
import { Renderable } from '../renderable';

export class Tetromino extends Grid implements Renderable {
	constructor( width: number, height: number, hue: number ) {
		super( width, height );
		this.#hue = hue;
	}

	public get hue() {
		return this.#hue;
	}

	public set hue( value: number ) {
		this.#hue = value;
		this.forEach( ( x, y, b ) => b.hue = this.#hue );
	}

	#hue: number;
	public grid: Grid;
	public x: number;
	public y: number;

	public addBlock( x: number, y: number ) {
		this.set( x, y, new Block( this.#hue ) );
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();
		c2d.translate( Block.width * ( this.x ?? 0 ), Block.height * ( this.y ?? 0 ) );
		super.render( c2d );
		c2d.restore();
	}
}
