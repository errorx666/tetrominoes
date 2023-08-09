import { Grid } from './grid';

export class Board extends Grid implements Renderable {
	constructor() {
		super( 10, 24 );
	}
}
