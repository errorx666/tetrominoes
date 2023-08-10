import { TetrominoL } from './l';

export class TetrominoLMirrored extends TetrominoL {
	constructor( hue: number = 240 ) {
		super( hue );

		this.mirror();
	}
}
