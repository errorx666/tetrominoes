import { Tetromino } from './tetromino';

export class TetrominoT extends Tetromino {
	constructor( hue: number = 300 ) {
		super( 3, 3, hue );
		this.addBlock( 0, 0 );
		this.addBlock( 1, 0 );
		this.addBlock( 2, 0 );
		this.addBlock( 1, 1 );
	}
}
