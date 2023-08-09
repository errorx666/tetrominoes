import { StopWatch } from './stop-watch';

export class Block implements Renderable {
	constructor( hue: number ) {
		this.hue = hue;
	}

	public static width = 24;
	public static height = 24;

	private _hue: number;

	public get hue() { return this._hue; }
	public set hue( value: number ) {
		this._hue = value;
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		var e = Block._stopWatch.elapsed,
			g25 = Math.sin( e / 3000 ) * .2 + .3,
			g75 = Math.cos( e / 3000 ) * .2 + .6;

		var g = c2d.createRadialGradient( Block.width * g75, Block.height * g25, 0, Block.width * g75, Block.height * g25, 16 );
		g.addColorStop( 0, 'hsl(' + [ this.hue, '100%', '80%' ].join( ',' ) + ')' );
		g.addColorStop( .75, 'hsl(' + [ this.hue, '100%', '50%' ].join( ',' ) + ')' );

		c2d.fillStyle = g;
		c2d.fillRect( .5, .5, Block.width - 1, Block.height - 1 );
		c2d.strokeStyle = 'hsl(' + [ this.hue, '100%', '90%' ].join( ',' ) + ')';
		c2d.strokeRect( 1.5, 1.5, Block.width - 3, Block.height - 3 );
		c2d.restore();
	}

	private static _stopWatch = StopWatch.start();
}
