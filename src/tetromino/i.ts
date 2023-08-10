import { Tetromino } from './tetromino';

export class TetrominoI extends Tetromino {
	constructor( hue: number = 180 ) {
		super( 2, 4, hue );
		this.addBlock( 0, 0 );
		this.addBlock( 0, 1 );
		this.addBlock( 0, 2 );
		this.addBlock( 0, 3 );
	}
}
