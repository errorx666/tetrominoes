import { Tetromino } from './tetromino';

export class TetrominoO extends Tetromino {
	constructor( hue: number = 60 ) {
		super( 2, 2, hue );
		this.addBlock( 0, 0 );
		this.addBlock( 0, 1 );
		this.addBlock( 1, 0 );
		this.addBlock( 1, 1 );
	}
}
