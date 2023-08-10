import { Tetromino } from './tetromino';

export class TetrominoL extends Tetromino {
	constructor( hue: number = 35 ) {
		super( 3, 3, hue );
		this.addBlock( 0, 0 );
		this.addBlock( 0, 1 );
		this.addBlock( 0, 2 );
		this.addBlock( 1, 2 );
	}
}
