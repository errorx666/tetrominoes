import { Tetromino } from './tetromino';

export class TetrominoS extends Tetromino {
	constructor( hue: number = 120 ) {
		super( 3, 3, hue );
		this.addBlock( 1, 0 );
		this.addBlock( 2, 0 );
		this.addBlock( 0, 1 );
		this.addBlock( 1, 1 );
	}
}
