import { TetrominoS } from './s';

export class TetrominoSMirrored extends TetrominoS {
	constructor( hue: number = 0 ) {
		super( hue );

		this.mirror();
	}
}
