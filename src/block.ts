import { hsl, oklch } from './color';
import { Renderable } from './renderable';
import { StopWatch } from './stop-watch';

export class Block implements Renderable {
	constructor( public hue: number ) {}

	public static width = 42;
	public static height = 42;

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		const e = Block.#stopWatch.elapsed;
		const g25 = Math.sin( e / 3000 ) * .2 + .3;
		const g75 = Math.cos( e / 3000 ) * .2 + .6;

		const g = c2d.createRadialGradient( Block.width * g75, Block.height * g25, 0, Block.width * g75, Block.height * g25, 16 );
		g.addColorStop( 0, hsl( this.hue, 1, .8 ) );
		g.addColorStop( .75, hsl( this.hue, 1, .5 ) );

		c2d.fillStyle = g;
		c2d.fillRect( .5, .5, Block.width - 1, Block.height - 1 );
		c2d.strokeStyle = hsl( this.hue, 1, .9 );
		c2d.strokeRect( 1.5, 1.5, Block.width - 3, Block.height - 3 );
		c2d.restore();
	}

	static #stopWatch = StopWatch.start();
}
